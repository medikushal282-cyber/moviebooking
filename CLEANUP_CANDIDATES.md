# Cleanup Candidates

The following files appear to be backups, temporary files, or unrelated to the core application logic and can likely be deleted or migrated to clean up the project structure.

## Backup & Temporary Files (Safe to Delete)
*   `movies.html.backup`: Older backup of the movies page.
*   `movies_backup_20251123223923.html`: Timestamped backup.
*   `movies_corrupted_backup.html`: Corrupted backup file.
*   `movies_ending.html`: Appears to be a fragment or temporary version.
*   `movies_temp_top.html`: Temporary layout file.

## Documentation (Optional Cleanup)
*   `viva_questions.md`: Contains interview/viva questions, not part of the application code.

## Migration Candidates (To Be Replaced Eventually)
*   `data.js`: Contains hardcoded movie and theatre data. This is still used by `select-seats.html` but should be migrated to fetch from the MongoDB database via API instead.

## IDE Configuration (Personal Preference)
*   `.vscode/` directory: Contains VS Code workspace settings. Safe to delete if you want to share the project without IDE-specific configs, or keep if you want consistent settings across team members.

## Recommendation
*   **Immediate Cleanup**: Delete all backup/temporary files from the first section.
*   **After Migration**: Once `select-seats.html` is updated to use the database API, delete `data.js`.
*   **Optional**: Move `viva_questions.md` to a separate `docs/` folder or delete if not needed.
