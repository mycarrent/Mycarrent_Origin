# My Car Rent - Full-Stack Upgrade TODO

## Authentication & OAuth
- [x] Resolve file conflicts from full-stack upgrade
- [x] Fix provider order in main.tsx (QueryClientProvider wrapping trpc.Provider)
- [x] Create Login page with Google OAuth button
- [x] Add protected routes with authentication checks
- [x] Fix page flicker bug (moved ThemeProvider outside ErrorBoundary)
- [ ] Test Google OAuth login flow
- [ ] Verify user session persistence
- [ ] Test logout functionality

## Database Integration
- [ ] Configure MySQL database connection
- [ ] Run `pnpm db:push` to sync schema
- [ ] Test database connectivity
- [ ] Migrate existing IndexedDB data to MySQL (optional)

## Feature Migration
- [ ] Ensure Dashboard works with full-stack
- [ ] Ensure Task entry works with full-stack
- [ ] Ensure History page works with full-stack
- [ ] Ensure Reports page works with full-stack
- [ ] Ensure Vehicle management works with full-stack
- [ ] Ensure Settings page works with full-stack
- [ ] Verify backup/restore still works
- [ ] Verify dark mode still works
- [ ] Verify sub-categories still work

## Testing
- [x] Write vitest tests for authentication
- [x] Write vitest tests for logout
- [x] Run all tests: `pnpm test` - All tests passing (4 passed)

## Deployment
- [ ] Create checkpoint before deployment
- [ ] Test on staging environment
- [ ] Deploy to production
