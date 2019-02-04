A grant is a combination of:
- a **who** group that is receiving permissions
- one or more **permissions** (may-read-resource, may-write-fields, etc)
- **types restriction**, which limits both resource-level
and field-level permissions in the grant to only the listed
content-types.
- an optional **fields restriction**, which limits any field-level
permissions in the grant to only the listed fields.

## Who: Assigning the Group
The `who` relationship determines who we are giving permission to. It is a list, and a user must match _every_ entry in the list in order to benefit from the grant. Each item in the list is a reference to one of the following things:

### Who: A user
Which content-types are used to represent users is app-specific, based on the set of authenticator plugins you configure and how you map them into your own user types. But if you allow people to log in as `{ type: 'users', id: '1' }`, then you can put `{ type: 'users', id: '1' }` here in the `who` relationship and it will apply to that specific user.

### Who: A group

A group in the `who` relationship is used like `{ type: 'groups', id: someGroupId }`, in which case the grant will apply to all users who are members of that group.

Cardstack comes with a predefined group, `everyone`. It can be used to grant permissions to any user requesting a resource, whether they're authenticated or not. The following example illustrates its usage:

```javascript
factory
  .addResource('grants')
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated(
    'types',
    [{ type: 'content-types', id: 'example-blogs' }]
  )
  .withAttributes({
    'may-read-resource': true,
    'may-read-fields': true
  });
```

Whoever, we often want to have more specific groups to restrain permissions. Groups are defined as following:
```javascript

factory.addResource('groups', 'example-readers').withAttributes({
  'search-query': {
    filter: {
      type: { exact: 'example-users' },
      permissions: { exact: 'cardstack/example-data:read' }
    }
  }
});
```

Then we can use our newly defined group in a grant as:

```javascript
factory
  .addResource('grants')
  .withRelated('who', [{ type: 'groups', id: 'example-readers' }])
  .withRelated(
    'types',
    [{ type: 'content-types', id: 'example-blogs' }]
  )
  .withAttributes({
    'may-read-resource': true,
    'may-read-fields': true
  });
```

To assign a user to a group we set the group permissions on the user when we define it as:

```javascript

factory.addResource('example-users', 'test-user')
  .withAttributes({
    'name': 'Carl Stack',
    'email-address': 'user@cardstack.com',
    'permissions': [
      'cardstack/example-data:read',
    ]
  });
```

### Who: A field

`who` can be described with a field defined as `{ type: 'fields', id: someFieldName }`, in which case the set of users will be determined dynamically by looking at the value of given resource's field. The field itself must be either:
- a relationship to one or many users.
- the `id` field, which is treated implicitly as a relationship
to the record itself, meaning you can write a grant against the `id` field in order to give a user permissions to their own user record.

In general, it is better to use groups rather than make lots of separate grants for each user. The biggest use for individual user grants is when you use them via field indirection, so that a resource can contain its own list of owners, etc.

For example, you can have a resource like this that stores its own collaborators list and a set of unbanned users:
```javascript
{
  type: 'posts',
  id: '1',
  relationships: {
    collaborators: {
      data: [ { type: 'users', id: '1'}, { type: 'users', id: '2' } ]
    },
    'unbanned-users': {
      data: [ { type: 'users', id: '1' }, { type: 'users', id: '3' }]
    }
  }
}
```
The `who` relationship in a grant when using a `field` works as an _and_ rather than an _or_. This means that if we specify a grant pointing to the `collaborators` as follows, we will give permissions to `users` `1` and `2`.

```javascript
factory
  .addResource('grants')
  .withRelated('who', [
    { type: 'fields', id: 'collaborators' }
  ])
  .withRelated('types', [{ type: 'content-types', id: 'posts' }])
  .withAttributes({
    'may-update-resource': true,
    'may-write-fields': true
  });
  // Both `users` `1` and `2` will get permissions
```

But if we specify that the grant's `who` is both `collaborators` and `unbanned-users`, we will only give permissions to `users` `1` because it's the only one in both lists.

```javascript
factory
  .addResource('grants')
  .withRelated('who', [
    { type: 'fields', id: 'collaborators' },
    { type: 'groups', id: 'unbanned-users' }
  ])
  .withRelated('types', [{ type: 'content-types', id: 'posts' }])
  .withAttributes({
    'may-update-resource': true,
    'may-write-fields': true
  });
  // Only `users` `1` will get permissions
```

## Permissions Architecture

Permissions fall into two categories: per-resource and per-field. Here I will explain how permissions interact under each CRUD operation:

### Create
When you try to create a resource, we first check for `may-read-resource` and `may-create-resource`. It's not possible to create a resource that you aren't authorized to read, because JSON:API POST always echos back the created object.
After you pass those two resource-level checks, we move on to field-level checks.
You must have `may-read-fields` for each field that you include. This is for the same reason as needing `may-read-resource` -- JSON:API always echos back when you do a write, so we insist that you have read permissions too.
You must have `may-write-fields` for each field that you include that has a value different from its default-at-create value. This means we are tolerant of including a field that you don't have permission to modify, so long as you aren't actually trying to modify it.
To set a user-provided "id", the user needs `may-write-fields` permission on "id". Without it, they are forced to accept a server-provided id.

### Read
When you try to read a resource, we first check for `may-read-resource`. If you don't have it, you will see a 404, because you aren't authorized to know whether the resource even exists.
After you pass that resource-level check, we apply field level checks to limit the response. The response will only includes fields for which you have the `may-read-fields` permission.
The "type" and "id" fields are fundamental to JSON:API, so you do not need explicit `may-read-fields` permission for them. They are implicitly allowed to be read as long as you have may-read-resource.
If you lack `may-read-fields` permission on a relationship field, it won't be present in data.relationships in the response, and so it necessarily also cannot be present in data.includes (because the JSON:API spec requires full linkage).
If you have `may-read-fields` permission on a relationship field, it will be present in data.relationships. In order for a related resource to also appear in `includes` (either because you asked for it via the `?include=` query parameter or because of the schema's default-includes) you must have `may-read-resource` permission on the related resource, and we will recurse into it to enforce field level `may-read-resource` permissions.
In other words, having `may-read-fields` on a relationship field is distinct from having `may-read-resource` on the resource that the relationship points at.

### Update
When you try to update a resource, we first check for `may-read-resource` and `may-update-resource`. It's not possible to update a resource that you aren't authorized to read, because JSON:API PATCH always echos back the modified object.
After you pass those two resource-level checks, we move on to field-level checks.
You must have `may-read-fields` for each field that you include. This is for the same reason as needing `may-read-resource` -- JSON:API always echos back when you do a write, so we insist that you have read permissions too. We are also avoiding a potential information leak, because if we tolerated the presence of a field you're not allowed to read, it would let you probe for the current value, since `may-write-fields` is deliberately tolerant of unchanged values.
For each field you include, we check for `may-writes-fields` *if* the value of the field differs from what it would have been if you didn't include the field at all. "What it would have been" depends on the old value of the field and any default-at-update in the schema.

### Delete
When you try to delete a resource, we check for `may-delete-resource`, and that's it. We aren't checking `may-read-resource` because a DELETE doesn't echo back the resource.
In practice, you will usually need `may-read-resource` anyway, because many data sources require an If-Match header on DELETE, in order to avoid race conditions, and you won't be able to come up with the current version for If-Match without first reading the resource.

## Types restrictions

We can apply restrictions to certain types by specifying the `type` relationship on a grant. You **must** specify the `types` relationship, otherwise no permissions will be applied. For instance, we to protect a certain type you can describe the grant as follows:

```javascript
factory
  .addResource('grants')
  .withRelated('who', [{ type: 'groups', id: 'example-managers' }])
  .withRelated(
    'types',
    [{ type: 'content-types', id: 'financial-reports' }]
  )
  .withAttributes({
    'may-read-resource': true,
    'may-read-fields': true
  });
```

In order to apply a grant to all types we need to be explicit. This means we need a list of all the types registered on the hub. We can speficy such grant as follows:

```javascript

// Form a lit of all the registered types
let contentTypes = cardSchemas
  .getModels()
  .filter(i => i.type === 'content-types' && i.id !== 'search-results')
  .map(i => {
    return { type: 'content-types', id: i.id };
  });

factory
  .addResource('grants')
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated(
    'types',
    // We used the registered types, plus systemm cards too
    contentTypes.concat([
      { type: 'content-types', id: 'content-types' },
      { type: 'content-types', id: 'spaces' },
      { type: 'content-types', id: 'app-cards' },
      { type: 'content-types', id: 'search-results' }
    ])
  )
  .withAttributes({
    'may-read-resource': true
  });
```

## Fields restrictions (optional)

We can specify to which fields a certain grant applies. If you do not specify the fields for a grant, the permissions will be applied to all the fields of the types you describe. We can even apply different grants to specific fields in a single entity. The following example illustrates the concept:

```javascript
let publicFields = [
  { type: 'fields', id: 'name' },
  { type: 'fields', id: 'year' },
  { type: 'fields', id: 'net-profits' },
];
let privateFields = [
  { type: 'fields', id: 'payroll' }
];

factory
  .addResource('grants')
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated('types', [{ type: 'content-types', id: 'reports' }])
  .withRelated('fields', publicFields)
  .withAttributes({
    'may-read-fields': true
  });

factory
  .addResource('grants')
  .withRelated('who', [{ type: 'groups', id: 'example-managers' }])
  .withRelated('types', [{ type: 'content-types', id: 'reports' }])
  .withRelated('fields', privateFields)
  .withAttributes({
    'may-read-fields': true
  });
```

However, due the way fields are defined in cardstack you cannot set different permissions to two fields of the same name, even if they are in different entities. For instance, the following **will not work**:

```javascript
factory
  .addResource('grants')
  .withRelated('who', [{ type: 'groups', id: 'everyone' }])
  .withRelated('types', [{ type: 'content-types', id: 'sale-products' }])
  .withRelated('fields', [{ id: 'fields', id: 'price' }])
  .withAttributes({
    'may-read-fields': true
  });

factory
  .addResource('grants')
  .withRelated('who', [{ type: 'groups', id: 'example-managers' }])
  .withRelated('types', [{ type: 'content-types', id: 'secret-product' }])
  .withRelated('fields', [{ id: 'fields', id: 'price' }])
  .withAttributes({
    'may-read-fields': true
  });
```

You would have to rename the `price` field name to be unique for each to achieve the desired permissions.
