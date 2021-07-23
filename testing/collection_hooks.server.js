import { assert } from 'chai';
import { _ } from 'meteor/underscore';

describe.skip('It should work with collection:hooks', function () {
  const opts = [
    {},
    { channel: 'xxx' },
  ];

  let idx = 1;

  opts.forEach((options) => {
    const Collection = new Mongo.Collection('test_redis_collection_hooks_' + idx++);
    Collection.remove({});

    it('should detect all types of changes: ' + JSON.stringify(options), function () {
      const updates = {
        'before.insert': false,
        'after.insert': false,
        'before.update': false,
        'after.update': false,
        'before.remove': false,
        'after.remove': false
      };

      Collection.before.insert(function () {
        updates['before.insert'] = true;
      });
      Collection.after.insert(function () {
        updates['after.insert'] = true;
      });
      Collection.before.update(function () {
        updates['before.update'] = true;
      });
      Collection.after.update(function () {
        updates['after.update'] = true;
      });
      Collection.before.remove(function () {
        updates['before.remove'] = true;
      });
      Collection.after.remove(function () {
        updates['after.remove'] = true;
      });

      const id = Collection.insert({ someData: true });
      Collection.update(id, { someData: false });
      Collection.remove(id);

      _.each(updates, (value, key) => {
        assert.isTrue(value, key);
      });
    });
  });
});
