import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// CORE TABLES
// ============================================================================

// Users table - manages authentication and user profiles (Better Auth compatible)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  preferences: jsonb('preferences'), // UI settings, themes, etc.
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Better Auth tables (using users table above)
export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date())
});

// Workspaces - top-level organization (like Notion workspaces)
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 100 }),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  settings: jsonb('settings'), // workspace-level settings
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('workspaces_owner_id_idx').on(table.ownerId),
]);

// Workspace members - who has access to what workspace
export const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'), // 'owner', 'admin', 'member', 'viewer'
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('workspace_members_workspace_user_idx')
    .on(table.workspaceId, table.userId),
]);

// ============================================================================
// ORGANIZATION TABLES
// ============================================================================

// Folders - hierarchical organization
export const folders: any = pgTable('folders', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 100 }),
  color: varchar('color', { length: 7 }), // hex color
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  parentId: uuid('parent_id').references(() => folders.id),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('folders_workspace_id_idx').on(table.workspaceId),
  index('folders_parent_id_idx').on(table.parentId),
  index('folders_position_idx').on(table.parentId, table.position),
]);

// Tags - flexible labeling system
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }), // hex color
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('tags_workspace_id_idx').on(table.workspaceId),
  uniqueIndex('tags_name_workspace_idx')
    .on(table.name, table.workspaceId),
]);

// ============================================================================
// CONTENT TABLES
// ============================================================================

// Notes - the main content containers (like Notion pages)
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  icon: varchar('icon', { length: 100 }), // emoji or icon identifier
  coverImage: varchar('cover_image', { length: 500 }),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  folderId: uuid('folder_id').references(() => folders.id),
  parentId: uuid('parent_id').references(() => notes.id), // for sub-pages
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  
  // Page type and structure
  pageType: varchar('page_type', { length: 50 }).default('page'), // 'page', 'database', 'template'
  databaseType: varchar('database_type', { length: 50 }), // 'table', 'board', 'calendar', 'gallery', 'list'
  position: integer('position').default(0), // order within parent/folder
  
  // Status flags
  isFavorite: boolean('is_favorite').default(false),
  isPinned: boolean('is_pinned').default(false),
  isArchived: boolean('is_archived').default(false),
  isPublic: boolean('is_public').default(false),
  isTemplate: boolean('is_template').default(false),
  isLocked: boolean('is_locked').default(false),
  
  // Content and metadata
  properties: jsonb('properties'), // custom properties like Notion databases
  schema: jsonb('schema'), // database schema for database pages
  viewSettings: jsonb('view_settings'), // view configurations
  
  // SEO and sharing
  slug: varchar('slug', { length: 255 }), // for public pages
  metaDescription: text('meta_description'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastViewedAt: timestamp('last_viewed_at'),
  publishedAt: timestamp('published_at'),
}, (table) => [
  index('notes_workspace_id_idx').on(table.workspaceId),
  index('notes_folder_id_idx').on(table.folderId),
  index('notes_parent_id_idx').on(table.parentId),
  index('notes_created_by_idx').on(table.createdBy),
  index('notes_created_at_idx').on(table.createdAt),
  index('notes_title_idx').on(table.title),
  index('notes_is_archived_idx').on(table.isArchived),
  index('notes_page_type_idx').on(table.pageType),
  index('notes_slug_idx').on(table.slug),
  index('notes_position_idx').on(table.folderId, table.parentId, table.position),
]);

// Blocks - the core of the block-based editor (like Notion blocks)
export const blocks: any = pgTable('blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }).notNull(),
  parentId: uuid('parent_id').references(() => blocks.id, { onDelete: 'cascade' }), // for nested blocks
  
  // Block structure
  type: varchar('type', { length: 50 }).notNull(), // 'paragraph', 'heading1-6', 'bulleted_list', 'numbered_list', 'to_do', 'toggle', 'quote', 'divider', 'callout', 'code', 'image', 'video', 'file', 'bookmark', 'table', 'column_list', 'column', 'embed', 'equation', 'breadcrumb', 'table_of_contents', 'link_to_page', 'synced_block', 'template', 'database'
  content: jsonb('content').notNull(), // block content and properties
  properties: jsonb('properties'), // block-specific properties (color, checked state, etc.)
  position: integer('position').notNull(), // order within parent/note
  
  // Block metadata
  isToggled: boolean('is_toggled').default(true), // for toggle blocks
  backgroundColor: varchar('background_color', { length: 50 }), // block background
  textColor: varchar('text_color', { length: 50 }), // text color
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('blocks_note_id_idx').on(table.noteId),
  index('blocks_parent_id_idx').on(table.parentId),
  index('blocks_position_idx').on(table.noteId, table.parentId, table.position),
  index('blocks_type_idx').on(table.type),
  index('blocks_updated_at_idx').on(table.updatedAt),
]);

// ============================================================================
// RELATIONSHIP TABLES
// ============================================================================

// Note tags - many-to-many relationship between notes and tags
export const noteTags = pgTable('note_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }).notNull(),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('note_tags_note_tag_idx').on(table.noteId, table.tagId),
  index('note_tags_note_id_idx').on(table.noteId),
  index('note_tags_tag_id_idx').on(table.tagId),
]);

// ============================================================================
// COLLABORATION TABLES
// ============================================================================

// Block comments - collaborative commenting on specific blocks
export const blockComments = pgTable('block_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  blockId: uuid('block_id').references(() => blocks.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  isResolved: boolean('is_resolved').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('block_comments_block_id_idx').on(table.blockId),
  index('block_comments_user_id_idx').on(table.userId),
  index('block_comments_created_at_idx').on(table.createdAt),
]);

// Note permissions - granular access control
export const notePermissions = pgTable('note_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  permission: varchar('permission', { length: 20 }).notNull(), // 'view', 'comment', 'edit', 'admin'
  grantedBy: uuid('granted_by').references(() => users.id).notNull(),
  grantedAt: timestamp('granted_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('note_permissions_note_user_idx').on(table.noteId, table.userId),
  index('note_permissions_note_id_idx').on(table.noteId),
  index('note_permissions_user_id_idx').on(table.userId),
]);

// ============================================================================
// UTILITY TABLES
// ============================================================================

// Attachments - file attachments linked to blocks or notes
export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }),
  blockId: uuid('block_id').references(() => blocks.id, { onDelete: 'cascade' }),
  
  // File metadata
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  
  // Storage info
  url: varchar('url', { length: 1000 }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // 'google_drive', 'local', 's3', etc.
  providerId: varchar('provider_id', { length: 255 }),
  
  // Metadata
  uploadedBy: uuid('uploaded_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('attachments_note_id_idx').on(table.noteId),
  index('attachments_block_id_idx').on(table.blockId),
  index('attachments_uploaded_by_idx').on(table.uploadedBy),
]);

// Saved searches - user's saved search queries
export const savedSearches = pgTable('saved_searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  query: varchar('query', { length: 500 }).notNull(),
  filters: jsonb('filters'), // search filters as JSON
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('saved_searches_workspace_id_idx').on(table.workspaceId),
  index('saved_searches_user_id_idx').on(table.userId),
]);

// Templates - reusable note/block structures
export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  category: varchar('category', { length: 100 }),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  isPublic: boolean('is_public').default(false),
  blocks: jsonb('blocks').notNull(), // template block structure
  properties: jsonb('properties'), // template properties
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('templates_workspace_id_idx').on(table.workspaceId),
  index('templates_created_by_idx').on(table.createdBy),
  index('templates_category_idx').on(table.category),
]);

// Activity log - track changes for collaboration
export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }),
  blockId: uuid('block_id').references(() => blocks.id, { onDelete: 'cascade' }),
  
  action: varchar('action', { length: 50 }).notNull(), // 'created', 'updated', 'deleted', etc.
  entityType: varchar('entity_type', { length: 50 }).notNull(), // 'note', 'block', 'comment', etc.
  details: jsonb('details'), // additional action details
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('activity_log_workspace_id_idx').on(table.workspaceId),
  index('activity_log_user_id_idx').on(table.userId),
  index('activity_log_note_id_idx').on(table.noteId),
  index('activity_log_created_at_idx').on(table.createdAt),
  index('activity_log_action_idx').on(table.action),
]);

// Database views - different views for database pages (like Notion database views)
export const databaseViews = pgTable('database_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  databaseId: uuid('database_id').references(() => notes.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'table', 'board', 'calendar', 'gallery', 'list'
  
  // View configuration
  filters: jsonb('filters'), // view filters
  sorts: jsonb('sorts'), // sorting configuration
  groupBy: jsonb('group_by'), // grouping configuration
  visibleProperties: jsonb('visible_properties'), // which properties to show
  
  // Display settings
  isDefault: boolean('is_default').default(false),
  position: integer('position').default(0),
  
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('database_views_database_id_idx').on(table.databaseId),
  index('database_views_created_by_idx').on(table.createdBy),
  index('database_views_position_idx').on(table.databaseId, table.position),
]);

// Page relations - links between pages (like Notion relations)
export const pageRelations = pgTable('page_relations', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromPageId: uuid('from_page_id').references(() => notes.id, { onDelete: 'cascade' }).notNull(),
  toPageId: uuid('to_page_id').references(() => notes.id, { onDelete: 'cascade' }).notNull(),
  relationType: varchar('relation_type', { length: 50 }).notNull(), // 'reference', 'backlink', 'relation_property'
  propertyName: varchar('property_name', { length: 255 }), // for relation properties
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('page_relations_from_page_idx').on(table.fromPageId),
  index('page_relations_to_page_idx').on(table.toPageId),
  index('page_relations_type_idx').on(table.relationType),
  uniqueIndex('page_relations_unique_idx').on(table.fromPageId, table.toPageId, table.relationType, table.propertyName),
]);

// Real-time collaboration - track active users and cursors
export const collaborationSessions = pgTable('collaboration_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Session info
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  cursorPosition: jsonb('cursor_position'), // current cursor/selection
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
}, (table) => [
  index('collaboration_sessions_note_id_idx').on(table.noteId),
  index('collaboration_sessions_user_id_idx').on(table.userId),
  index('collaboration_sessions_active_idx').on(table.isActive),
  uniqueIndex('collaboration_sessions_unique_idx').on(table.noteId, table.userId, table.sessionId),
]);

// Page history - version control for pages
export const pageHistory = pgTable('page_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  // Version info
  version: integer('version').notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  content: jsonb('content').notNull(), // snapshot of blocks
  properties: jsonb('properties'),
  
  // Change tracking
  changeType: varchar('change_type', { length: 50 }).notNull(), // 'manual_save', 'auto_save', 'restore'
  changeDescription: text('change_description'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('page_history_note_id_idx').on(table.noteId),
  index('page_history_user_id_idx').on(table.userId),
  index('page_history_created_at_idx').on(table.createdAt),
  index('page_history_version_idx').on(table.noteId, table.version),
]);

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  ownedWorkspaces: many(workspaces),
  workspaceMemberships: many(workspaceMembers),
  createdNotes: many(notes),
  blockComments: many(blockComments),
  notePermissions: many(notePermissions),
  attachments: many(attachments),
  savedSearches: many(savedSearches),
  templates: many(templates),
  activityLog: many(activityLog),
  databaseViews: many(databaseViews),
  collaborationSessions: many(collaborationSessions),
  pageHistory: many(pageHistory),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  folders: many(folders),
  tags: many(tags),
  notes: many(notes),
  savedSearches: many(savedSearches),
  templates: many(templates),
  activityLog: many(activityLog),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [folders.workspaceId],
    references: [workspaces.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  children: many(folders),
  notes: many(notes),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [tags.workspaceId],
    references: [workspaces.id],
  }),
  noteTags: many(noteTags),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [notes.workspaceId],
    references: [workspaces.id],
  }),
  folder: one(folders, {
    fields: [notes.folderId],
    references: [folders.id],
  }),
  parent: one(notes, {
    fields: [notes.parentId],
    references: [notes.id],
  }),
  creator: one(users, {
    fields: [notes.createdBy],
    references: [users.id],
  }),
  children: many(notes),
  blocks: many(blocks),
  noteTags: many(noteTags),
  permissions: many(notePermissions),
  attachments: many(attachments),
  activityLog: many(activityLog),
  databaseViews: many(databaseViews),
  relationsFrom: many(pageRelations, { relationName: 'fromPage' }),
  relationsTo: many(pageRelations, { relationName: 'toPage' }),
  collaborationSessions: many(collaborationSessions),
  history: many(pageHistory),
}));

export const blocksRelations = relations(blocks, ({ one, many }) => ({
  note: one(notes, {
    fields: [blocks.noteId],
    references: [notes.id],
  }),
  parent: one(blocks, {
    fields: [blocks.parentId],
    references: [blocks.id],
  }),
  children: many(blocks),
  comments: many(blockComments),
  attachments: many(attachments),
  activityLog: many(activityLog),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, {
    fields: [noteTags.noteId],
    references: [notes.id],
  }),
  tag: one(tags, {
    fields: [noteTags.tagId],
    references: [tags.id],
  }),
}));

export const blockCommentsRelations = relations(blockComments, ({ one }) => ({
  block: one(blocks, {
    fields: [blockComments.blockId],
    references: [blocks.id],
  }),
  user: one(users, {
    fields: [blockComments.userId],
    references: [users.id],
  }),
}));

export const notePermissionsRelations = relations(notePermissions, ({ one }) => ({
  note: one(notes, {
    fields: [notePermissions.noteId],
    references: [notes.id],
  }),
  user: one(users, {
    fields: [notePermissions.userId],
    references: [users.id],
  }),
  grantedByUser: one(users, {
    fields: [notePermissions.grantedBy],
    references: [users.id],
  }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  note: one(notes, {
    fields: [attachments.noteId],
    references: [notes.id],
  }),
  block: one(blocks, {
    fields: [attachments.blockId],
    references: [blocks.id],
  }),
  uploader: one(users, {
    fields: [attachments.uploadedBy],
    references: [users.id],
  }),
}));

export const savedSearchesRelations = relations(savedSearches, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [savedSearches.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [savedSearches.userId],
    references: [users.id],
  }),
}));

export const templatesRelations = relations(templates, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [templates.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [templates.createdBy],
    references: [users.id],
  }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [activityLog.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [activityLog.userId],
    references: [users.id],
  }),
  note: one(notes, {
    fields: [activityLog.noteId],
    references: [notes.id],
  }),
  block: one(blocks, {
    fields: [activityLog.blockId],
    references: [blocks.id],
  }),
}));

export const databaseViewsRelations = relations(databaseViews, ({ one }) => ({
  database: one(notes, {
    fields: [databaseViews.databaseId],
    references: [notes.id],
  }),
  creator: one(users, {
    fields: [databaseViews.createdBy],
    references: [users.id],
  }),
}));

export const pageRelationsRelations = relations(pageRelations, ({ one }) => ({
  fromPage: one(notes, {
    fields: [pageRelations.fromPageId],
    references: [notes.id],
    relationName: 'fromPage',
  }),
  toPage: one(notes, {
    fields: [pageRelations.toPageId],
    references: [notes.id],
    relationName: 'toPage',
  }),
}));

export const collaborationSessionsRelations = relations(collaborationSessions, ({ one }) => ({
  note: one(notes, {
    fields: [collaborationSessions.noteId],
    references: [notes.id],
  }),
  user: one(users, {
    fields: [collaborationSessions.userId],
    references: [users.id],
  }),
}));

export const pageHistoryRelations = relations(pageHistory, ({ one }) => ({
  note: one(notes, {
    fields: [pageHistory.noteId],
    references: [notes.id],
  }),
  user: one(users, {
    fields: [pageHistory.userId],
    references: [users.id],
  }),
}));
