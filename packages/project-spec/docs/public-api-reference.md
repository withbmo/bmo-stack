# Public API Reference

## Primary Functions

### `parseProjectSpec(input)`

Accepts TOML text or an object and returns a normalized `ProjectSpec`.

Throws `ProjectSpecError` on TOML parse errors or schema failures.

### `validateProjectSpec(spec)`

Runs cross-reference and invariant validation on a parsed `ProjectSpec`.

Examples:

- duplicate ids
- service -> artifact references
- route -> service references
- binding -> resource references
- unsupported spec version
- missing default environment

### `createBuildPlan(spec)`

Returns the normalized build surface for all buildable artifacts.

### `createRuntimePlan(spec, environmentName?)`

Returns the runnable service/resource view for a chosen environment.

### `createRoutePlan(spec)`

Returns the explicit routing surface derived from the spec.

### `createProjectPlans(spec, environmentName?)`

Convenience helper returning all three plans at once.

## Error Type

### `ProjectSpecError`

Fields:

- `message`
- `issues`

Each issue contains:

- `path`
- `message`

This is intended for UI-safe validation reporting and API responses.
