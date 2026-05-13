# Member Role Update Feature Design

## Purpose
Allow high-role users (Super Admin, President, Secretary) to add new roles to an existing member. The update will be performed via a "Manage Roles" modal accessible from the Member Details screen.

## UI/UX
- **Visibility**: A "Manage Roles" button will be rendered on the `MemberDetailScreen` only if the current user has `HIGH_ROLE_ACCESS`.
- **Placement**: A new button "Manage Roles" placed below the member's quick info grid or next to the status badges.
- **Interactions**:
  - Tapping "Manage Roles" opens a Modal/Dialog.
  - The modal displays the user's current roles and provides a way to add a new role.
  - The UI will present a list (or dropdown) of available roles that the member *does not* currently have.
  - Selecting a role and confirming will show a loading state and make the API call.
  - Upon success, the modal will close (or show a success message) and the member details will update to reflect the newly added role.

## Technical Architecture
- **Hook**: Create a new mutation hook `useAddMemberRole` in `src/features/members/hooks/use-add-member-role.ts`.
- **API Constant**: Add the role update endpoint to `src/features/members/utils/constants/endpoints.ts` (e.g. `addRole: (id: string) => '/members/' + id + '/role'`).
- **Endpoint Call**: It will call `PATCH /members/:id/role` via the configured `http` client. Payload: `{ role: string }` (sending one role at a time).
- **Cache Invalidation**: On success, the hook must invalidate the `MemberQueryKeys.detail(id)` and `MemberQueryKeys.all()` to ensure the UI updates immediately.
- **Role Verification**: Utilize `useAuthStore` to get the current user's role and `hasHighRoleAccess` from `src/features/meetings/utils/permission.ts` to determine visibility.

## Components
- Create a `ManageRolesModal` component that receives the `memberId` and the `currentRoles`. 
- Use the existing `Modal` or `Dialog` UI components from `src/shared/components/ui` if available, or a standard React Native `Modal`.

## Error Handling
- Failed mutations will display a toast/alert with the error message.
- The submit button within the modal will remain disabled during the loading state to prevent duplicate submissions.
