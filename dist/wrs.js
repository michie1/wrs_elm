
(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(x, y)
{
	var stack = [];
	var isEqual = eqHelp(x, y, 0, stack);
	var pair;
	while (isEqual && (pair = stack.pop()))
	{
		isEqual = eqHelp(pair.x, pair.y, 0, stack);
	}
	return isEqual;
}


function eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push({ x: x, y: y });
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object')
	{
		if (typeof x === 'function')
		{
			throw new Error(
				'Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.'
				+ ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#=='
				+ ' which describes why it is this way and what the better version will look like.'
			);
		}
		return false;
	}

	if (x === null || y === null)
	{
		return false
	}

	if (x instanceof Date)
	{
		return x.getTime() === y.getTime();
	}

	if (!('ctor' in x))
	{
		for (var key in x)
		{
			if (!eqHelp(x[key], y[key], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	// convert Dicts and Sets to lists
	if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin')
	{
		x = _elm_lang$core$Dict$toList(x);
		y = _elm_lang$core$Dict$toList(y);
	}
	if (x.ctor === 'Set_elm_builtin')
	{
		x = _elm_lang$core$Set$toList(x);
		y = _elm_lang$core$Set$toList(y);
	}

	// check if lists are equal without recursion
	if (x.ctor === '::')
	{
		var a = x;
		var b = y;
		while (a.ctor === '::' && b.ctor === '::')
		{
			if (!eqHelp(a._0, b._0, depth + 1, stack))
			{
				return false;
			}
			a = a._1;
			b = b._1;
		}
		return a.ctor === b.ctor;
	}

	// check if Arrays are equal
	if (x.ctor === '_Array')
	{
		var xs = _elm_lang$core$Native_Array.toJSArray(x);
		var ys = _elm_lang$core$Native_Array.toJSArray(y);
		if (xs.length !== ys.length)
		{
			return false;
		}
		for (var i = 0; i < xs.length; i++)
		{
			if (!eqHelp(xs[i], ys[i], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	if (!eqHelp(x.ctor, y.ctor, depth + 1, stack))
	{
		return false;
	}

	for (var key in x)
	{
		if (!eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}

	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? EQ : a < b ? LT : GT;
	}

	if (x.ctor === '::' || x.ctor === '[]')
	{
		while (x.ctor === '::' && y.ctor === '::')
		{
			var ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
		return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
	}

	if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var ord;
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}

	throw new Error(
		'Comparison error: comparison is only defined on ints, '
		+ 'floats, times, chars, strings, lists of comparable values, '
		+ 'and tuples of comparable values.'
	);
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		return '<function>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'Set_elm_builtin')
		{
			return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin')
		{
			return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		if (v instanceof Date)
		{
			return '<' + v.toString() + '>';
		}

		if (v.elm_web_socket)
		{
			return '<websocket>';
		}

		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
			  .replace(/\n/g, '\\n')
			  .replace(/\t/g, '\\t')
			  .replace(/\r/g, '\\r')
			  .replace(/\v/g, '\\v')
			  .replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$never = function (_p0) {
	never:
	while (true) {
		var _p1 = _p0;
		var _v1 = _p1._0;
		_p0 = _v1;
		continue never;
	}
};
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$always = F2(
	function (a, _p4) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$JustOneMore = function (a) {
	return {ctor: 'JustOneMore', _0: a};
};

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p3 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p3.ctor === '_Tuple2') && (_p3._0.ctor === 'Just')) && (_p3._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p4 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p4.ctor === '_Tuple3') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === 'Just')) && (_p4._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p5 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p5.ctor === '_Tuple4') && (_p5._0.ctor === 'Just')) && (_p5._1.ctor === 'Just')) && (_p5._2.ctor === 'Just')) && (_p5._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p6 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p6.ctor === '_Tuple5') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) && (_p6._2.ctor === 'Just')) && (_p6._3.ctor === 'Just')) && (_p6._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$singleton = function (value) {
	return {
		ctor: '::',
		_0: value,
		_1: {ctor: '[]'}
	};
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			_elm_lang$core$List$any,
			function (_p2) {
				return !isOkay(_p2);
			},
			list);
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return {
						ctor: '::',
						_0: f(x),
						_1: acc
					};
				}),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (front, back) {
				return pred(front) ? {ctor: '::', _0: front, _1: back} : back;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return {ctor: '::', _0: _p10._0, _1: xs};
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return {ctor: '::', _0: x, _1: y};
			}),
		{ctor: '[]'},
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, x, _p11._0),
						_1: accAcc
					};
				} else {
					return {ctor: '[]'};
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				{
					ctor: '::',
					_0: b,
					_1: {ctor: '[]'}
				},
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		{ctor: '[]'},
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: {ctor: '::', _0: x, _1: _p16},
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: {ctor: '::', _0: x, _1: _p15}
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: {ctor: '[]'},
				_1: {ctor: '[]'}
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: _p19._0, _1: _p20._0},
				_1: {ctor: '::', _0: _p19._1, _1: _p20._1}
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var step = F2(
				function (x, rest) {
					return {
						ctor: '::',
						_0: sep,
						_1: {ctor: '::', _0: x, _1: rest}
					};
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				{ctor: '[]'},
				_p21._1);
			return {ctor: '::', _0: _p21._0, _1: spersed};
		}
	});
var _elm_lang$core$List$takeReverse = F3(
	function (n, list, taken) {
		takeReverse:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
						_v24 = _p22._1,
						_v25 = {ctor: '::', _0: _p22._0, _1: taken};
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
var _elm_lang$core$List$takeTailRec = F2(
	function (n, list) {
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$takeReverse,
				n,
				list,
				{ctor: '[]'}));
	});
var _elm_lang$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return {ctor: '[]'};
		} else {
			var _p23 = {ctor: '_Tuple2', _0: n, _1: list};
			_v26_5:
			do {
				_v26_1:
				do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return {
											ctor: '::',
											_0: _p23._1._0,
											_1: {
												ctor: '::',
												_0: _p23._1._1._0,
												_1: {ctor: '[]'}
											}
										};
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return {
												ctor: '::',
												_0: _p23._1._0,
												_1: {
													ctor: '::',
													_0: _p23._1._1._0,
													_1: {
														ctor: '::',
														_0: _p23._1._1._1._0,
														_1: {ctor: '[]'}
													}
												}
											};
										} else {
											break _v26_5;
										}
									default:
										if ((_p23._1._1._1.ctor === '::') && (_p23._1._1._1._1.ctor === '::')) {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return (_elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0) ? {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A2(_elm_lang$core$List$takeTailRec, n - 4, _p24)
														}
													}
												}
											} : {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)
														}
													}
												}
											};
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while(false);
				return {
					ctor: '::',
					_0: _p23._1._0,
					_1: {ctor: '[]'}
				};
			} while(false);
			return list;
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = {ctor: '::', _0: value, _1: result},
					_v28 = n - 1,
					_v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			{ctor: '[]'},
			n,
			value);
	});
var _elm_lang$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
					_v31 = hi - 1,
					_v32 = {ctor: '::', _0: hi, _1: list};
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var _elm_lang$core$List$range = F2(
	function (lo, hi) {
		return A3(
			_elm_lang$core$List$rangeHelp,
			lo,
			hi,
			{ctor: '[]'});
	});
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			A2(
				_elm_lang$core$List$range,
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});

var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		A2(
			_elm_lang$core$List$range,
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _elm_lang$core$Native_List.Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _elm_lang$core$Native_List.fromArray(is);
}


function toInt(s)
{
	var len = s.length;

	// if empty
	if (len === 0)
	{
		return intErr(s);
	}

	// if hex
	var c = s[0];
	if (c === '0' && s[1] === 'x')
	{
		for (var i = 2; i < len; ++i)
		{
			var c = s[i];
			if (('0' <= c && c <= '9') || ('A' <= c && c <= 'F') || ('a' <= c && c <= 'f'))
			{
				continue;
			}
			return intErr(s);
		}
		return _elm_lang$core$Result$Ok(parseInt(s, 16));
	}

	// is decimal
	if (c > '9' || (c < '0' && c !== '-' && c !== '+'))
	{
		return intErr(s);
	}
	for (var i = 1; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return intErr(s);
		}
	}

	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function intErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int");
}


function toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return floatErr(s);
	}
	var n = +s;
	// faster isNaN check
	return n === n ? _elm_lang$core$Result$Ok(n) : floatErr(s);
}

function floatErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float");
}


function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$mapError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return {ctor: '::', _0: key, _1: keyList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return {ctor: '::', _0: value, _1: valueList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: key, _1: value},
					_1: list
				};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				stepState:
				while (true) {
					var _p3 = _p2;
					var _p9 = _p3._1;
					var _p8 = _p3._0;
					var _p4 = _p8;
					if (_p4.ctor === '[]') {
						return {
							ctor: '_Tuple2',
							_0: _p8,
							_1: A3(rightStep, rKey, rValue, _p9)
						};
					} else {
						var _p7 = _p4._1;
						var _p6 = _p4._0._1;
						var _p5 = _p4._0._0;
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
							var _v10 = rKey,
								_v11 = rValue,
								_v12 = {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A3(leftStep, _p5, _p6, _p9)
							};
							rKey = _v10;
							rValue = _v11;
							_p2 = _v12;
							continue stepState;
						} else {
							if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
								return {
									ctor: '_Tuple2',
									_0: _p8,
									_1: A3(rightStep, rKey, rValue, _p9)
								};
							} else {
								return {
									ctor: '_Tuple2',
									_0: _p7,
									_1: A4(bothStep, _p5, _p6, rValue, _p9)
								};
							}
						}
					}
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				{
					ctor: '::',
					_0: 'Internal red-black tree invariant violated, expected ',
					_1: {
						ctor: '::',
						_0: msg,
						_1: {
							ctor: '::',
							_0: ' and got ',
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Basics$toString(c),
								_1: {
									ctor: '::',
									_0: '/',
									_1: {
										ctor: '::',
										_0: lgot,
										_1: {
											ctor: '::',
											_0: '/',
											_1: {
												ctor: '::',
												_0: rgot,
												_1: {
													ctor: '::',
													_0: '\nPlease report this bug to <https://github.com/elm-lang/core/issues>',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v14_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v14_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v14_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
							_v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
							_v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v26 = _p18._1,
					_v27 = _p18._2,
					_v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v36_6:
	do {
		_v36_5:
		do {
			_v36_4:
			do {
				_v36_3:
				do {
					_v36_2:
					do {
						_v36_1:
						do {
							_v36_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v36_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v36_3;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v36_4;
																	} else {
																		break _v36_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	break _v36_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v36_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															} else {
																break _v36_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v36_5;
															} else {
																break _v36_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	break _v36_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v36_4;
															} else {
																break _v36_6;
															}
														default:
															break _v36_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v36_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v36_1;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v36_5;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v36_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v36_3;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v36_4;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										} else {
											break _v36_6;
										}
									}
								} else {
									break _v36_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (color, left, right) {
		var _p29 = {ctor: '_Tuple2', _0: left, _1: right};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						color,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						color,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeIndex(index, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'index',
		index: index,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function mapMany(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function andThen(callback, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function map1(f, d1)
{
	return mapMany(f, [d1]);
}

function map2(f, d1, d2)
{
	return mapMany(f, [d1, d2]);
}

function map3(f, d1, d2, d3)
{
	return mapMany(f, [d1, d2, d3]);
}

function map4(f, d1, d2, d3, d4)
{
	return mapMany(f, [d1, d2, d3, d4]);
}

function map5(f, d1, d2, d3, d4, d5)
{
	return mapMany(f, [d1, d2, d3, d4, d5]);
}

function map6(f, d1, d2, d3, d4, d5, d6)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6]);
}

function map7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function map8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok') ? result : badField(field, result);

		case 'index':
			var index = decoder.index;
			if (!(value instanceof Array))
			{
				return badPrimitive('an array', value);
			}
			if (index >= value.length)
			{
				return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
			}

			var result = runHelp(decoder.decoder, value[index]);
			return (result.tag === 'ok') ? result : badIndex(index, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'index':
			return a.index === b.index && equality(a.decoder, b.decoder);

		case 'map-many':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),
	decodeIndex: F2(decodeIndex),

	map1: F2(map1),
	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	map6: F7(map6),
	map7: F8(map7),
	map8: F9(map8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	andThen: F2(andThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$lazy = function (thunk) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		thunk,
		_elm_lang$core$Json_Decode$succeed(
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$nullable = function (decoder) {
	return _elm_lang$core$Json_Decode$oneOf(
		{
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder),
				_1: {ctor: '[]'}
			}
		});
};
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

var _elm_lang$core$Tuple$mapSecond = F2(
	function (func, _p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: func(_p1._1)
		};
	});
var _elm_lang$core$Tuple$mapFirst = F2(
	function (func, _p2) {
		var _p3 = _p2;
		return {
			ctor: '_Tuple2',
			_0: func(_p3._0),
			_1: _p3._1
		};
	});
var _elm_lang$core$Tuple$second = function (_p4) {
	var _p5 = _p4;
	return _p5._1;
};
var _elm_lang$core$Tuple$first = function (_p6) {
	var _p7 = _p6;
	return _p7._0;
};

//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function program(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flags !== 'undefined')
				{
					throw new Error(
						'The `' + moduleName + '` module does not need flags.\n'
						+ 'Call ' + moduleName + '.worker() with no arguments and you should be all set!'
					);
				}

				return initialize(
					impl.init,
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function programWithFlags(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flagDecoder === 'undefined')
				{
					throw new Error(
						'Are you trying to sneak a Never value into Elm? Trickster!\n'
						+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
						+ 'Use `program` instead if you do not want flags.'
					);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Err')
				{
					throw new Error(
						moduleName + '.worker(...) was called with an unexpected argument.\n'
						+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
						+ result._0
					);
				}

				return initialize(
					impl.init(result._0),
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function renderer(enqueue, _)
{
	return function(_) {};
}


// HTML TO PROGRAM

function htmlToProgram(vnode)
{
	var emptyBag = batch(_elm_lang$core$Native_List.Nil);
	var noChange = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		emptyBag
	);

	return _elm_lang$virtual_dom$VirtualDom$program({
		init: noChange,
		view: function(model) { return main; },
		update: F2(function(msg, model) { return noChange; }),
		subscriptions: function (model) { return emptyBag; }
	});
}


// INITIALIZE A PROGRAM

function initialize(init, update, subscriptions, renderer)
{
	// ambient state
	var managers = {};
	var updateView;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var model = init._0;
		updateView = renderer(enqueue, model);
		var cmds = init._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			updateView(model);
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, loop, handleMsg);
	}

	var task = A2(andThen, loop, init);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = converter(cmdList._0);
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}


// INCOMING PORTS

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var sentBeforeInit = [];
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;
	var currentOnEffects = preInitOnEffects;
	var currentSend = preInitSend;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function preInitOnEffects(router, subList, state)
	{
		var postInitResult = postInitOnEffects(router, subList, state);

		for(var i = 0; i < sentBeforeInit.length; i++)
		{
			postInitSend(sentBeforeInit[i]);
		}

		sentBeforeInit = null; // to release objects held in queue
		currentSend = postInitSend;
		currentOnEffects = postInitOnEffects;
		return postInitResult;
	}

	function postInitOnEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	function onEffects(router, subList, state)
	{
		return currentOnEffects(router, subList, state);
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function preInitSend(value)
	{
		sentBeforeInit.push(value);
	}

	function postInitSend(value)
	{
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	function send(incomingValue)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		currentSend(result._0);
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,

	htmlToProgram: htmlToProgram,
	program: program,
	programWithFlags: programWithFlags,
	initialize: initialize,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(callback, task)
{
	return {
		ctor: '_Task_andThen',
		callback: callback,
		task: task
	};
}

function onError(callback, task)
{
	return {
		ctor: '_Task_onError',
		callback: callback,
		task: task
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		if (process.root)
		{
			numSteps = step(numSteps, process);
		}
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode = _elm_lang$core$Json_Decode$succeed;
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$resolve = _elm_lang$core$Json_Decode$andThen(_elm_lang$core$Basics$identity);
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom = _elm_lang$core$Json_Decode$map2(
	F2(
		function (x, y) {
			return y(x);
		}));
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded = function (_p0) {
	return _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom(
		_elm_lang$core$Json_Decode$succeed(_p0));
};
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return _elm_lang$core$Json_Decode$oneOf(
				{
					ctor: '::',
					_0: decoder,
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Json_Decode$null(fallback),
						_1: {ctor: '[]'}
					}
				});
		};
		var handleResult = function (input) {
			var _p1 = A2(_elm_lang$core$Json_Decode$decodeValue, pathDecoder, input);
			if (_p1.ctor === 'Ok') {
				var _p2 = A2(
					_elm_lang$core$Json_Decode$decodeValue,
					nullOr(valDecoder),
					_p1._0);
				if (_p2.ctor === 'Ok') {
					return _elm_lang$core$Json_Decode$succeed(_p2._0);
				} else {
					return _elm_lang$core$Json_Decode$fail(_p2._0);
				}
			} else {
				return _elm_lang$core$Json_Decode$succeed(fallback);
			}
		};
		return A2(_elm_lang$core$Json_Decode$andThen, handleResult, _elm_lang$core$Json_Decode$value);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalAt = F4(
	function (path, valDecoder, fallback, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalDecoder,
				A2(_elm_lang$core$Json_Decode$at, path, _elm_lang$core$Json_Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalDecoder,
				A2(_elm_lang$core$Json_Decode$field, key, _elm_lang$core$Json_Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$requiredAt = F3(
	function (path, valDecoder, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A2(_elm_lang$core$Json_Decode$at, path, valDecoder),
			decoder);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A2(_elm_lang$core$Json_Decode$field, key, valDecoder),
			decoder);
	});

var _elm_lang$core$Native_Bitwise = function() {

return {
	and: F2(function and(a, b) { return a & b; }),
	or: F2(function or(a, b) { return a | b; }),
	xor: F2(function xor(a, b) { return a ^ b; }),
	complement: function complement(a) { return ~a; },
	shiftLeftBy: F2(function(offset, a) { return a << offset; }),
	shiftRightBy: F2(function(offset, a) { return a >> offset; }),
	shiftRightZfBy: F2(function(offset, a) { return a >>> offset; })
};

}();

var _elm_lang$core$Bitwise$shiftRightZfBy = _elm_lang$core$Native_Bitwise.shiftRightZfBy;
var _elm_lang$core$Bitwise$shiftRightBy = _elm_lang$core$Native_Bitwise.shiftRightBy;
var _elm_lang$core$Bitwise$shiftLeftBy = _elm_lang$core$Native_Bitwise.shiftLeftBy;
var _elm_lang$core$Bitwise$complement = _elm_lang$core$Native_Bitwise.complement;
var _elm_lang$core$Bitwise$xor = _elm_lang$core$Native_Bitwise.xor;
var _elm_lang$core$Bitwise$or = _elm_lang$core$Native_Bitwise.or;
var _elm_lang$core$Bitwise$and = _elm_lang$core$Native_Bitwise.and;

var _Skinney$murmur3$Murmur3$mur = F2(
	function (c, h) {
		return 4294967295 & (((h & 65535) * c) + ((65535 & ((h >>> 16) * c)) << 16));
	});
var _Skinney$murmur3$Murmur3$step = function (acc) {
	var h1 = A2(_Skinney$murmur3$Murmur3$mur, 5, (acc >>> 19) | (acc << 13));
	return ((h1 & 65535) + 27492) + ((65535 & ((h1 >>> 16) + 58964)) << 16);
};
var _Skinney$murmur3$Murmur3$mix = F2(
	function (h1, h2) {
		var k1 = A2(_Skinney$murmur3$Murmur3$mur, 3432918353, h2);
		return h1 ^ A2(_Skinney$murmur3$Murmur3$mur, 461845907, (k1 >>> 17) | (k1 << 15));
	});
var _Skinney$murmur3$Murmur3$finalize = F2(
	function (strLength, _p0) {
		var _p1 = _p0;
		var _p3 = _p1._1;
		var _p2 = _p1._2;
		var acc = (!_elm_lang$core$Native_Utils.eq(_p2, 0)) ? A2(_Skinney$murmur3$Murmur3$mix, _p3, _p2) : _p3;
		var h1 = acc ^ strLength;
		var h2 = A2(_Skinney$murmur3$Murmur3$mur, 2246822507, h1 ^ (h1 >>> 16));
		var h3 = A2(_Skinney$murmur3$Murmur3$mur, 3266489909, h2 ^ (h2 >>> 13));
		return (h3 ^ (h3 >>> 16)) >>> 0;
	});
var _Skinney$murmur3$Murmur3$hashFold = F2(
	function (c, _p4) {
		var _p5 = _p4;
		var _p7 = _p5._0;
		var _p6 = _p5._1;
		var res = _p5._2 | ((255 & _elm_lang$core$Char$toCode(c)) << _p7);
		if (_elm_lang$core$Native_Utils.cmp(_p7, 24) > -1) {
			var newHash = _Skinney$murmur3$Murmur3$step(
				A2(_Skinney$murmur3$Murmur3$mix, _p6, res));
			return {ctor: '_Tuple3', _0: 0, _1: newHash, _2: 0};
		} else {
			return {ctor: '_Tuple3', _0: _p7 + 8, _1: _p6, _2: res};
		}
	});
var _Skinney$murmur3$Murmur3$hashString = F2(
	function (seed, str) {
		return A2(
			_Skinney$murmur3$Murmur3$finalize,
			_elm_lang$core$String$length(str),
			A3(
				_elm_lang$core$String$foldl,
				_Skinney$murmur3$Murmur3$hashFold,
				{ctor: '_Tuple3', _0: 0, _1: seed, _2: 0},
				str));
	});

//import Result //

var _elm_lang$core$Native_Date = function() {

function fromString(str)
{
	var date = new Date(str);
	return isNaN(date.getTime())
		? _elm_lang$core$Result$Err('Unable to parse \'' + str + '\' as a date. Dates must be in the ISO 8601 format.')
		: _elm_lang$core$Result$Ok(date);
}

var dayTable = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthTable =
	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


return {
	fromString: fromString,
	year: function(d) { return d.getFullYear(); },
	month: function(d) { return { ctor: monthTable[d.getMonth()] }; },
	day: function(d) { return d.getDate(); },
	hour: function(d) { return d.getHours(); },
	minute: function(d) { return d.getMinutes(); },
	second: function(d) { return d.getSeconds(); },
	millisecond: function(d) { return d.getMilliseconds(); },
	toTime: function(d) { return d.getTime(); },
	fromTime: function(t) { return new Date(t); },
	dayOfWeek: function(d) { return { ctor: dayTable[d.getDay()] }; }
};

}();
var _elm_lang$core$Task$onError = _elm_lang$core$Native_Scheduler.onError;
var _elm_lang$core$Task$andThen = _elm_lang$core$Native_Scheduler.andThen;
var _elm_lang$core$Task$spawnCmd = F2(
	function (router, _p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Scheduler.spawn(
			A2(
				_elm_lang$core$Task$andThen,
				_elm_lang$core$Platform$sendToApp(router),
				_p1._0));
	});
var _elm_lang$core$Task$fail = _elm_lang$core$Native_Scheduler.fail;
var _elm_lang$core$Task$mapError = F2(
	function (convert, task) {
		return A2(
			_elm_lang$core$Task$onError,
			function (_p2) {
				return _elm_lang$core$Task$fail(
					convert(_p2));
			},
			task);
	});
var _elm_lang$core$Task$succeed = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return _elm_lang$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var _elm_lang$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return _elm_lang$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map3 = F4(
	function (func, taskA, taskB, taskC) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return _elm_lang$core$Task$succeed(
									A3(func, a, b, c));
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map4 = F5(
	function (func, taskA, taskB, taskC, taskD) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return _elm_lang$core$Task$succeed(
											A4(func, a, b, c, d));
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map5 = F6(
	function (func, taskA, taskB, taskC, taskD, taskE) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return A2(
											_elm_lang$core$Task$andThen,
											function (e) {
												return _elm_lang$core$Task$succeed(
													A5(func, a, b, c, d, e));
											},
											taskE);
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$sequence = function (tasks) {
	var _p3 = tasks;
	if (_p3.ctor === '[]') {
		return _elm_lang$core$Task$succeed(
			{ctor: '[]'});
	} else {
		return A3(
			_elm_lang$core$Task$map2,
			F2(
				function (x, y) {
					return {ctor: '::', _0: x, _1: y};
				}),
			_p3._0,
			_elm_lang$core$Task$sequence(_p3._1));
	}
};
var _elm_lang$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			_elm_lang$core$Task$map,
			function (_p4) {
				return {ctor: '_Tuple0'};
			},
			_elm_lang$core$Task$sequence(
				A2(
					_elm_lang$core$List$map,
					_elm_lang$core$Task$spawnCmd(router),
					commands)));
	});
var _elm_lang$core$Task$init = _elm_lang$core$Task$succeed(
	{ctor: '_Tuple0'});
var _elm_lang$core$Task$onSelfMsg = F3(
	function (_p7, _p6, _p5) {
		return _elm_lang$core$Task$succeed(
			{ctor: '_Tuple0'});
	});
var _elm_lang$core$Task$command = _elm_lang$core$Native_Platform.leaf('Task');
var _elm_lang$core$Task$Perform = function (a) {
	return {ctor: 'Perform', _0: a};
};
var _elm_lang$core$Task$perform = F2(
	function (toMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(_elm_lang$core$Task$map, toMessage, task)));
	});
var _elm_lang$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(
					_elm_lang$core$Task$onError,
					function (_p8) {
						return _elm_lang$core$Task$succeed(
							resultToMessage(
								_elm_lang$core$Result$Err(_p8)));
					},
					A2(
						_elm_lang$core$Task$andThen,
						function (_p9) {
							return _elm_lang$core$Task$succeed(
								resultToMessage(
									_elm_lang$core$Result$Ok(_p9)));
						},
						task))));
	});
var _elm_lang$core$Task$cmdMap = F2(
	function (tagger, _p10) {
		var _p11 = _p10;
		return _elm_lang$core$Task$Perform(
			A2(_elm_lang$core$Task$map, tagger, _p11._0));
	});
_elm_lang$core$Native_Platform.effectManagers['Task'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Task$init, onEffects: _elm_lang$core$Task$onEffects, onSelfMsg: _elm_lang$core$Task$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Task$cmdMap};

//import Native.Scheduler //

var _elm_lang$core$Native_Time = function() {

var now = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	callback(_elm_lang$core$Native_Scheduler.succeed(Date.now()));
});

function setInterval_(interval, task)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var id = setInterval(function() {
			_elm_lang$core$Native_Scheduler.rawSpawn(task);
		}, interval);

		return function() { clearInterval(id); };
	});
}

return {
	now: now,
	setInterval_: F2(setInterval_)
};

}();
var _elm_lang$core$Time$setInterval = _elm_lang$core$Native_Time.setInterval_;
var _elm_lang$core$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		var _p0 = intervals;
		if (_p0.ctor === '[]') {
			return _elm_lang$core$Task$succeed(processes);
		} else {
			var _p1 = _p0._0;
			var spawnRest = function (id) {
				return A3(
					_elm_lang$core$Time$spawnHelp,
					router,
					_p0._1,
					A3(_elm_lang$core$Dict$insert, _p1, id, processes));
			};
			var spawnTimer = _elm_lang$core$Native_Scheduler.spawn(
				A2(
					_elm_lang$core$Time$setInterval,
					_p1,
					A2(_elm_lang$core$Platform$sendToSelf, router, _p1)));
			return A2(_elm_lang$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var _elm_lang$core$Time$addMySub = F2(
	function (_p2, state) {
		var _p3 = _p2;
		var _p6 = _p3._1;
		var _p5 = _p3._0;
		var _p4 = A2(_elm_lang$core$Dict$get, _p5, state);
		if (_p4.ctor === 'Nothing') {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				{
					ctor: '::',
					_0: _p6,
					_1: {ctor: '[]'}
				},
				state);
		} else {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				{ctor: '::', _0: _p6, _1: _p4._0},
				state);
		}
	});
var _elm_lang$core$Time$inMilliseconds = function (t) {
	return t;
};
var _elm_lang$core$Time$millisecond = 1;
var _elm_lang$core$Time$second = 1000 * _elm_lang$core$Time$millisecond;
var _elm_lang$core$Time$minute = 60 * _elm_lang$core$Time$second;
var _elm_lang$core$Time$hour = 60 * _elm_lang$core$Time$minute;
var _elm_lang$core$Time$inHours = function (t) {
	return t / _elm_lang$core$Time$hour;
};
var _elm_lang$core$Time$inMinutes = function (t) {
	return t / _elm_lang$core$Time$minute;
};
var _elm_lang$core$Time$inSeconds = function (t) {
	return t / _elm_lang$core$Time$second;
};
var _elm_lang$core$Time$now = _elm_lang$core$Native_Time.now;
var _elm_lang$core$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _p7 = A2(_elm_lang$core$Dict$get, interval, state.taggers);
		if (_p7.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			var tellTaggers = function (time) {
				return _elm_lang$core$Task$sequence(
					A2(
						_elm_lang$core$List$map,
						function (tagger) {
							return A2(
								_elm_lang$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						_p7._0));
			};
			return A2(
				_elm_lang$core$Task$andThen,
				function (_p8) {
					return _elm_lang$core$Task$succeed(state);
				},
				A2(_elm_lang$core$Task$andThen, tellTaggers, _elm_lang$core$Time$now));
		}
	});
var _elm_lang$core$Time$subscription = _elm_lang$core$Native_Platform.leaf('Time');
var _elm_lang$core$Time$State = F2(
	function (a, b) {
		return {taggers: a, processes: b};
	});
var _elm_lang$core$Time$init = _elm_lang$core$Task$succeed(
	A2(_elm_lang$core$Time$State, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty));
var _elm_lang$core$Time$onEffects = F3(
	function (router, subs, _p9) {
		var _p10 = _p9;
		var rightStep = F3(
			function (_p12, id, _p11) {
				var _p13 = _p11;
				return {
					ctor: '_Tuple3',
					_0: _p13._0,
					_1: _p13._1,
					_2: A2(
						_elm_lang$core$Task$andThen,
						function (_p14) {
							return _p13._2;
						},
						_elm_lang$core$Native_Scheduler.kill(id))
				};
			});
		var bothStep = F4(
			function (interval, taggers, id, _p15) {
				var _p16 = _p15;
				return {
					ctor: '_Tuple3',
					_0: _p16._0,
					_1: A3(_elm_lang$core$Dict$insert, interval, id, _p16._1),
					_2: _p16._2
				};
			});
		var leftStep = F3(
			function (interval, taggers, _p17) {
				var _p18 = _p17;
				return {
					ctor: '_Tuple3',
					_0: {ctor: '::', _0: interval, _1: _p18._0},
					_1: _p18._1,
					_2: _p18._2
				};
			});
		var newTaggers = A3(_elm_lang$core$List$foldl, _elm_lang$core$Time$addMySub, _elm_lang$core$Dict$empty, subs);
		var _p19 = A6(
			_elm_lang$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			_p10.processes,
			{
				ctor: '_Tuple3',
				_0: {ctor: '[]'},
				_1: _elm_lang$core$Dict$empty,
				_2: _elm_lang$core$Task$succeed(
					{ctor: '_Tuple0'})
			});
		var spawnList = _p19._0;
		var existingDict = _p19._1;
		var killTask = _p19._2;
		return A2(
			_elm_lang$core$Task$andThen,
			function (newProcesses) {
				return _elm_lang$core$Task$succeed(
					A2(_elm_lang$core$Time$State, newTaggers, newProcesses));
			},
			A2(
				_elm_lang$core$Task$andThen,
				function (_p20) {
					return A3(_elm_lang$core$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var _elm_lang$core$Time$Every = F2(
	function (a, b) {
		return {ctor: 'Every', _0: a, _1: b};
	});
var _elm_lang$core$Time$every = F2(
	function (interval, tagger) {
		return _elm_lang$core$Time$subscription(
			A2(_elm_lang$core$Time$Every, interval, tagger));
	});
var _elm_lang$core$Time$subMap = F2(
	function (f, _p21) {
		var _p22 = _p21;
		return A2(
			_elm_lang$core$Time$Every,
			_p22._0,
			function (_p23) {
				return f(
					_p22._1(_p23));
			});
	});
_elm_lang$core$Native_Platform.effectManagers['Time'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Time$init, onEffects: _elm_lang$core$Time$onEffects, onSelfMsg: _elm_lang$core$Time$onSelfMsg, tag: 'sub', subMap: _elm_lang$core$Time$subMap};

var _elm_lang$core$Date$millisecond = _elm_lang$core$Native_Date.millisecond;
var _elm_lang$core$Date$second = _elm_lang$core$Native_Date.second;
var _elm_lang$core$Date$minute = _elm_lang$core$Native_Date.minute;
var _elm_lang$core$Date$hour = _elm_lang$core$Native_Date.hour;
var _elm_lang$core$Date$dayOfWeek = _elm_lang$core$Native_Date.dayOfWeek;
var _elm_lang$core$Date$day = _elm_lang$core$Native_Date.day;
var _elm_lang$core$Date$month = _elm_lang$core$Native_Date.month;
var _elm_lang$core$Date$year = _elm_lang$core$Native_Date.year;
var _elm_lang$core$Date$fromTime = _elm_lang$core$Native_Date.fromTime;
var _elm_lang$core$Date$toTime = _elm_lang$core$Native_Date.toTime;
var _elm_lang$core$Date$fromString = _elm_lang$core$Native_Date.fromString;
var _elm_lang$core$Date$now = A2(_elm_lang$core$Task$map, _elm_lang$core$Date$fromTime, _elm_lang$core$Time$now);
var _elm_lang$core$Date$Date = {ctor: 'Date'};
var _elm_lang$core$Date$Sun = {ctor: 'Sun'};
var _elm_lang$core$Date$Sat = {ctor: 'Sat'};
var _elm_lang$core$Date$Fri = {ctor: 'Fri'};
var _elm_lang$core$Date$Thu = {ctor: 'Thu'};
var _elm_lang$core$Date$Wed = {ctor: 'Wed'};
var _elm_lang$core$Date$Tue = {ctor: 'Tue'};
var _elm_lang$core$Date$Mon = {ctor: 'Mon'};
var _elm_lang$core$Date$Dec = {ctor: 'Dec'};
var _elm_lang$core$Date$Nov = {ctor: 'Nov'};
var _elm_lang$core$Date$Oct = {ctor: 'Oct'};
var _elm_lang$core$Date$Sep = {ctor: 'Sep'};
var _elm_lang$core$Date$Aug = {ctor: 'Aug'};
var _elm_lang$core$Date$Jul = {ctor: 'Jul'};
var _elm_lang$core$Date$Jun = {ctor: 'Jun'};
var _elm_lang$core$Date$May = {ctor: 'May'};
var _elm_lang$core$Date$Apr = {ctor: 'Apr'};
var _elm_lang$core$Date$Mar = {ctor: 'Mar'};
var _elm_lang$core$Date$Feb = {ctor: 'Feb'};
var _elm_lang$core$Date$Jan = {ctor: 'Jan'};

var _elm_lang$core$Set$foldr = F3(
	function (f, b, _p0) {
		var _p1 = _p0;
		return A3(
			_elm_lang$core$Dict$foldr,
			F3(
				function (k, _p2, b) {
					return A2(f, k, b);
				}),
			b,
			_p1._0);
	});
var _elm_lang$core$Set$foldl = F3(
	function (f, b, _p3) {
		var _p4 = _p3;
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, _p5, b) {
					return A2(f, k, b);
				}),
			b,
			_p4._0);
	});
var _elm_lang$core$Set$toList = function (_p6) {
	var _p7 = _p6;
	return _elm_lang$core$Dict$keys(_p7._0);
};
var _elm_lang$core$Set$size = function (_p8) {
	var _p9 = _p8;
	return _elm_lang$core$Dict$size(_p9._0);
};
var _elm_lang$core$Set$member = F2(
	function (k, _p10) {
		var _p11 = _p10;
		return A2(_elm_lang$core$Dict$member, k, _p11._0);
	});
var _elm_lang$core$Set$isEmpty = function (_p12) {
	var _p13 = _p12;
	return _elm_lang$core$Dict$isEmpty(_p13._0);
};
var _elm_lang$core$Set$Set_elm_builtin = function (a) {
	return {ctor: 'Set_elm_builtin', _0: a};
};
var _elm_lang$core$Set$empty = _elm_lang$core$Set$Set_elm_builtin(_elm_lang$core$Dict$empty);
var _elm_lang$core$Set$singleton = function (k) {
	return _elm_lang$core$Set$Set_elm_builtin(
		A2(
			_elm_lang$core$Dict$singleton,
			k,
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Set$insert = F2(
	function (k, _p14) {
		var _p15 = _p14;
		return _elm_lang$core$Set$Set_elm_builtin(
			A3(
				_elm_lang$core$Dict$insert,
				k,
				{ctor: '_Tuple0'},
				_p15._0));
	});
var _elm_lang$core$Set$fromList = function (xs) {
	return A3(_elm_lang$core$List$foldl, _elm_lang$core$Set$insert, _elm_lang$core$Set$empty, xs);
};
var _elm_lang$core$Set$map = F2(
	function (f, s) {
		return _elm_lang$core$Set$fromList(
			A2(
				_elm_lang$core$List$map,
				f,
				_elm_lang$core$Set$toList(s)));
	});
var _elm_lang$core$Set$remove = F2(
	function (k, _p16) {
		var _p17 = _p16;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$remove, k, _p17._0));
	});
var _elm_lang$core$Set$union = F2(
	function (_p19, _p18) {
		var _p20 = _p19;
		var _p21 = _p18;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$union, _p20._0, _p21._0));
	});
var _elm_lang$core$Set$intersect = F2(
	function (_p23, _p22) {
		var _p24 = _p23;
		var _p25 = _p22;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$intersect, _p24._0, _p25._0));
	});
var _elm_lang$core$Set$diff = F2(
	function (_p27, _p26) {
		var _p28 = _p27;
		var _p29 = _p26;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$diff, _p28._0, _p29._0));
	});
var _elm_lang$core$Set$filter = F2(
	function (p, _p30) {
		var _p31 = _p30;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(
				_elm_lang$core$Dict$filter,
				F2(
					function (k, _p32) {
						return p(k);
					}),
				_p31._0));
	});
var _elm_lang$core$Set$partition = F2(
	function (p, _p33) {
		var _p34 = _p33;
		var _p35 = A2(
			_elm_lang$core$Dict$partition,
			F2(
				function (k, _p36) {
					return p(k);
				}),
			_p34._0);
		var p1 = _p35._0;
		var p2 = _p35._1;
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Set$Set_elm_builtin(p1),
			_1: _elm_lang$core$Set$Set_elm_builtin(p2)
		};
	});

var _elm_community$json_extra$Json_Decode_Extra$fromResult = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Json_Decode$succeed(_p0._0);
	} else {
		return _elm_lang$core$Json_Decode$fail(_p0._0);
	}
};
var _elm_community$json_extra$Json_Decode_Extra$sequenceHelp = F2(
	function (decoders, jsonValues) {
		return (!_elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(jsonValues),
			_elm_lang$core$List$length(decoders))) ? _elm_lang$core$Json_Decode$fail('Number of decoders does not match number of values') : _elm_community$json_extra$Json_Decode_Extra$fromResult(
			A3(
				_elm_lang$core$List$foldr,
				_elm_lang$core$Result$map2(
					F2(
						function (x, y) {
							return {ctor: '::', _0: x, _1: y};
						})),
				_elm_lang$core$Result$Ok(
					{ctor: '[]'}),
				A3(_elm_lang$core$List$map2, _elm_lang$core$Json_Decode$decodeValue, decoders, jsonValues)));
	});
var _elm_community$json_extra$Json_Decode_Extra$sequence = function (decoders) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		_elm_community$json_extra$Json_Decode_Extra$sequenceHelp(decoders),
		_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$value));
};
var _elm_community$json_extra$Json_Decode_Extra$optionalField = F2(
	function (fieldName, decoder) {
		var finishDecoding = function (json) {
			var _p1 = A2(
				_elm_lang$core$Json_Decode$decodeValue,
				A2(_elm_lang$core$Json_Decode$field, fieldName, _elm_lang$core$Json_Decode$value),
				json);
			if (_p1.ctor === 'Ok') {
				return A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder);
			} else {
				return _elm_lang$core$Json_Decode$succeed(_elm_lang$core$Maybe$Nothing);
			}
		};
		return A2(_elm_lang$core$Json_Decode$andThen, finishDecoding, _elm_lang$core$Json_Decode$value);
	});
var _elm_community$json_extra$Json_Decode_Extra$withDefault = F2(
	function (fallback, decoder) {
		return A2(
			_elm_lang$core$Json_Decode$andThen,
			function (_p2) {
				return _elm_lang$core$Json_Decode$succeed(
					A2(_elm_lang$core$Maybe$withDefault, fallback, _p2));
			},
			_elm_lang$core$Json_Decode$maybe(decoder));
	});
var _elm_community$json_extra$Json_Decode_Extra$decodeDictFromTuples = F2(
	function (keyDecoder, tuples) {
		var _p3 = tuples;
		if (_p3.ctor === '[]') {
			return _elm_lang$core$Json_Decode$succeed(_elm_lang$core$Dict$empty);
		} else {
			var _p4 = A2(_elm_lang$core$Json_Decode$decodeString, keyDecoder, _p3._0._0);
			if (_p4.ctor === 'Ok') {
				return A2(
					_elm_lang$core$Json_Decode$andThen,
					function (_p5) {
						return _elm_lang$core$Json_Decode$succeed(
							A3(_elm_lang$core$Dict$insert, _p4._0, _p3._0._1, _p5));
					},
					A2(_elm_community$json_extra$Json_Decode_Extra$decodeDictFromTuples, keyDecoder, _p3._1));
			} else {
				return _elm_lang$core$Json_Decode$fail(_p4._0);
			}
		}
	});
var _elm_community$json_extra$Json_Decode_Extra$dict2 = F2(
	function (keyDecoder, valueDecoder) {
		return A2(
			_elm_lang$core$Json_Decode$andThen,
			function (_p6) {
				return A2(
					_elm_community$json_extra$Json_Decode_Extra$decodeDictFromTuples,
					keyDecoder,
					_elm_lang$core$Dict$toList(_p6));
			},
			_elm_lang$core$Json_Decode$dict(valueDecoder));
	});
var _elm_community$json_extra$Json_Decode_Extra$set = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		function (_p7) {
			return _elm_lang$core$Json_Decode$succeed(
				_elm_lang$core$Set$fromList(_p7));
		},
		_elm_lang$core$Json_Decode$list(decoder));
};
var _elm_community$json_extra$Json_Decode_Extra$date = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (_p8) {
		return _elm_community$json_extra$Json_Decode_Extra$fromResult(
			_elm_lang$core$Date$fromString(_p8));
	},
	_elm_lang$core$Json_Decode$string);
var _elm_community$json_extra$Json_Decode_Extra$andMap = _elm_lang$core$Json_Decode$map2(
	F2(
		function (x, y) {
			return y(x);
		}));
var _elm_community$json_extra$Json_Decode_Extra_ops = _elm_community$json_extra$Json_Decode_Extra_ops || {};
_elm_community$json_extra$Json_Decode_Extra_ops['|:'] = _elm_lang$core$Basics$flip(_elm_community$json_extra$Json_Decode_Extra$andMap);

var _elm_community$list_extra$List_Extra$greedyGroupsOfWithStep = F3(
	function (size, step, xs) {
		var okayXs = _elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$List$length(xs),
			0) > 0;
		var okayArgs = (_elm_lang$core$Native_Utils.cmp(size, 0) > 0) && (_elm_lang$core$Native_Utils.cmp(step, 0) > 0);
		var xs_ = A2(_elm_lang$core$List$drop, step, xs);
		var group = A2(_elm_lang$core$List$take, size, xs);
		return (okayArgs && okayXs) ? {
			ctor: '::',
			_0: group,
			_1: A3(_elm_community$list_extra$List_Extra$greedyGroupsOfWithStep, size, step, xs_)
		} : {ctor: '[]'};
	});
var _elm_community$list_extra$List_Extra$greedyGroupsOf = F2(
	function (size, xs) {
		return A3(_elm_community$list_extra$List_Extra$greedyGroupsOfWithStep, size, size, xs);
	});
var _elm_community$list_extra$List_Extra$groupsOfWithStep = F3(
	function (size, step, xs) {
		var okayArgs = (_elm_lang$core$Native_Utils.cmp(size, 0) > 0) && (_elm_lang$core$Native_Utils.cmp(step, 0) > 0);
		var xs_ = A2(_elm_lang$core$List$drop, step, xs);
		var group = A2(_elm_lang$core$List$take, size, xs);
		var okayLength = _elm_lang$core$Native_Utils.eq(
			size,
			_elm_lang$core$List$length(group));
		return (okayArgs && okayLength) ? {
			ctor: '::',
			_0: group,
			_1: A3(_elm_community$list_extra$List_Extra$groupsOfWithStep, size, step, xs_)
		} : {ctor: '[]'};
	});
var _elm_community$list_extra$List_Extra$groupsOf = F2(
	function (size, xs) {
		return A3(_elm_community$list_extra$List_Extra$groupsOfWithStep, size, size, xs);
	});
var _elm_community$list_extra$List_Extra$zip5 = _elm_lang$core$List$map5(
	F5(
		function (v0, v1, v2, v3, v4) {
			return {ctor: '_Tuple5', _0: v0, _1: v1, _2: v2, _3: v3, _4: v4};
		}));
var _elm_community$list_extra$List_Extra$zip4 = _elm_lang$core$List$map4(
	F4(
		function (v0, v1, v2, v3) {
			return {ctor: '_Tuple4', _0: v0, _1: v1, _2: v2, _3: v3};
		}));
var _elm_community$list_extra$List_Extra$zip3 = _elm_lang$core$List$map3(
	F3(
		function (v0, v1, v2) {
			return {ctor: '_Tuple3', _0: v0, _1: v1, _2: v2};
		}));
var _elm_community$list_extra$List_Extra$zip = _elm_lang$core$List$map2(
	F2(
		function (v0, v1) {
			return {ctor: '_Tuple2', _0: v0, _1: v1};
		}));
var _elm_community$list_extra$List_Extra$isPrefixOf = function (prefix) {
	return function (_p0) {
		return A2(
			_elm_lang$core$List$all,
			_elm_lang$core$Basics$identity,
			A3(
				_elm_lang$core$List$map2,
				F2(
					function (x, y) {
						return _elm_lang$core$Native_Utils.eq(x, y);
					}),
				prefix,
				_p0));
	};
};
var _elm_community$list_extra$List_Extra$isSuffixOf = F2(
	function (suffix, xs) {
		return A2(
			_elm_community$list_extra$List_Extra$isPrefixOf,
			_elm_lang$core$List$reverse(suffix),
			_elm_lang$core$List$reverse(xs));
	});
var _elm_community$list_extra$List_Extra$selectSplit = function (xs) {
	var _p1 = xs;
	if (_p1.ctor === '[]') {
		return {ctor: '[]'};
	} else {
		var _p5 = _p1._1;
		var _p4 = _p1._0;
		return {
			ctor: '::',
			_0: {
				ctor: '_Tuple3',
				_0: {ctor: '[]'},
				_1: _p4,
				_2: _p5
			},
			_1: A2(
				_elm_lang$core$List$map,
				function (_p2) {
					var _p3 = _p2;
					return {
						ctor: '_Tuple3',
						_0: {ctor: '::', _0: _p4, _1: _p3._0},
						_1: _p3._1,
						_2: _p3._2
					};
				},
				_elm_community$list_extra$List_Extra$selectSplit(_p5))
		};
	}
};
var _elm_community$list_extra$List_Extra$select = function (xs) {
	var _p6 = xs;
	if (_p6.ctor === '[]') {
		return {ctor: '[]'};
	} else {
		var _p10 = _p6._1;
		var _p9 = _p6._0;
		return {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _p9, _1: _p10},
			_1: A2(
				_elm_lang$core$List$map,
				function (_p7) {
					var _p8 = _p7;
					return {
						ctor: '_Tuple2',
						_0: _p8._0,
						_1: {ctor: '::', _0: _p9, _1: _p8._1}
					};
				},
				_elm_community$list_extra$List_Extra$select(_p10))
		};
	}
};
var _elm_community$list_extra$List_Extra$tailsHelp = F2(
	function (e, list) {
		var _p11 = list;
		if (_p11.ctor === '::') {
			var _p12 = _p11._0;
			return {
				ctor: '::',
				_0: {ctor: '::', _0: e, _1: _p12},
				_1: {ctor: '::', _0: _p12, _1: _p11._1}
			};
		} else {
			return {ctor: '[]'};
		}
	});
var _elm_community$list_extra$List_Extra$tails = A2(
	_elm_lang$core$List$foldr,
	_elm_community$list_extra$List_Extra$tailsHelp,
	{
		ctor: '::',
		_0: {ctor: '[]'},
		_1: {ctor: '[]'}
	});
var _elm_community$list_extra$List_Extra$isInfixOf = F2(
	function (infix, xs) {
		return A2(
			_elm_lang$core$List$any,
			_elm_community$list_extra$List_Extra$isPrefixOf(infix),
			_elm_community$list_extra$List_Extra$tails(xs));
	});
var _elm_community$list_extra$List_Extra$inits = A2(
	_elm_lang$core$List$foldr,
	F2(
		function (e, acc) {
			return {
				ctor: '::',
				_0: {ctor: '[]'},
				_1: A2(
					_elm_lang$core$List$map,
					F2(
						function (x, y) {
							return {ctor: '::', _0: x, _1: y};
						})(e),
					acc)
			};
		}),
	{
		ctor: '::',
		_0: {ctor: '[]'},
		_1: {ctor: '[]'}
	});
var _elm_community$list_extra$List_Extra$groupWhileTransitively = F2(
	function (cmp, xs_) {
		var _p13 = xs_;
		if (_p13.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			if (_p13._1.ctor === '[]') {
				return {
					ctor: '::',
					_0: {
						ctor: '::',
						_0: _p13._0,
						_1: {ctor: '[]'}
					},
					_1: {ctor: '[]'}
				};
			} else {
				var _p15 = _p13._0;
				var _p14 = A2(_elm_community$list_extra$List_Extra$groupWhileTransitively, cmp, _p13._1);
				if (_p14.ctor === '::') {
					return A2(cmp, _p15, _p13._1._0) ? {
						ctor: '::',
						_0: {ctor: '::', _0: _p15, _1: _p14._0},
						_1: _p14._1
					} : {
						ctor: '::',
						_0: {
							ctor: '::',
							_0: _p15,
							_1: {ctor: '[]'}
						},
						_1: _p14
					};
				} else {
					return {ctor: '[]'};
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$stripPrefix = F2(
	function (prefix, xs) {
		var step = F2(
			function (e, m) {
				var _p16 = m;
				if (_p16.ctor === 'Nothing') {
					return _elm_lang$core$Maybe$Nothing;
				} else {
					if (_p16._0.ctor === '[]') {
						return _elm_lang$core$Maybe$Nothing;
					} else {
						return _elm_lang$core$Native_Utils.eq(e, _p16._0._0) ? _elm_lang$core$Maybe$Just(_p16._0._1) : _elm_lang$core$Maybe$Nothing;
					}
				}
			});
		return A3(
			_elm_lang$core$List$foldl,
			step,
			_elm_lang$core$Maybe$Just(xs),
			prefix);
	});
var _elm_community$list_extra$List_Extra$dropWhileRight = function (p) {
	return A2(
		_elm_lang$core$List$foldr,
		F2(
			function (x, xs) {
				return (p(x) && _elm_lang$core$List$isEmpty(xs)) ? {ctor: '[]'} : {ctor: '::', _0: x, _1: xs};
			}),
		{ctor: '[]'});
};
var _elm_community$list_extra$List_Extra$takeWhileRight = function (p) {
	var step = F2(
		function (x, _p17) {
			var _p18 = _p17;
			var _p19 = _p18._0;
			return (p(x) && _p18._1) ? {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: x, _1: _p19},
				_1: true
			} : {ctor: '_Tuple2', _0: _p19, _1: false};
		});
	return function (_p20) {
		return _elm_lang$core$Tuple$first(
			A3(
				_elm_lang$core$List$foldr,
				step,
				{
					ctor: '_Tuple2',
					_0: {ctor: '[]'},
					_1: true
				},
				_p20));
	};
};
var _elm_community$list_extra$List_Extra$splitAt = F2(
	function (n, xs) {
		return {
			ctor: '_Tuple2',
			_0: A2(_elm_lang$core$List$take, n, xs),
			_1: A2(_elm_lang$core$List$drop, n, xs)
		};
	});
var _elm_community$list_extra$List_Extra$groupsOfVarying_ = F3(
	function (listOflengths, list, accu) {
		groupsOfVarying_:
		while (true) {
			var _p21 = {ctor: '_Tuple2', _0: listOflengths, _1: list};
			if (((_p21.ctor === '_Tuple2') && (_p21._0.ctor === '::')) && (_p21._1.ctor === '::')) {
				var _p22 = A2(_elm_community$list_extra$List_Extra$splitAt, _p21._0._0, list);
				var head = _p22._0;
				var tail = _p22._1;
				var _v10 = _p21._0._1,
					_v11 = tail,
					_v12 = {ctor: '::', _0: head, _1: accu};
				listOflengths = _v10;
				list = _v11;
				accu = _v12;
				continue groupsOfVarying_;
			} else {
				return _elm_lang$core$List$reverse(accu);
			}
		}
	});
var _elm_community$list_extra$List_Extra$groupsOfVarying = F2(
	function (listOflengths, list) {
		return A3(
			_elm_community$list_extra$List_Extra$groupsOfVarying_,
			listOflengths,
			list,
			{ctor: '[]'});
	});
var _elm_community$list_extra$List_Extra$unfoldr = F2(
	function (f, seed) {
		var _p23 = f(seed);
		if (_p23.ctor === 'Nothing') {
			return {ctor: '[]'};
		} else {
			return {
				ctor: '::',
				_0: _p23._0._0,
				_1: A2(_elm_community$list_extra$List_Extra$unfoldr, f, _p23._0._1)
			};
		}
	});
var _elm_community$list_extra$List_Extra$scanr1 = F2(
	function (f, xs_) {
		var _p24 = xs_;
		if (_p24.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			if (_p24._1.ctor === '[]') {
				return {
					ctor: '::',
					_0: _p24._0,
					_1: {ctor: '[]'}
				};
			} else {
				var _p25 = A2(_elm_community$list_extra$List_Extra$scanr1, f, _p24._1);
				if (_p25.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, _p24._0, _p25._0),
						_1: _p25
					};
				} else {
					return {ctor: '[]'};
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$scanr = F3(
	function (f, acc, xs_) {
		var _p26 = xs_;
		if (_p26.ctor === '[]') {
			return {
				ctor: '::',
				_0: acc,
				_1: {ctor: '[]'}
			};
		} else {
			var _p27 = A3(_elm_community$list_extra$List_Extra$scanr, f, acc, _p26._1);
			if (_p27.ctor === '::') {
				return {
					ctor: '::',
					_0: A2(f, _p26._0, _p27._0),
					_1: _p27
				};
			} else {
				return {ctor: '[]'};
			}
		}
	});
var _elm_community$list_extra$List_Extra$scanl1 = F2(
	function (f, xs_) {
		var _p28 = xs_;
		if (_p28.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			return A3(_elm_lang$core$List$scanl, f, _p28._0, _p28._1);
		}
	});
var _elm_community$list_extra$List_Extra$indexedFoldr = F3(
	function (func, acc, list) {
		var step = F2(
			function (x, _p29) {
				var _p30 = _p29;
				var _p31 = _p30._0;
				return {
					ctor: '_Tuple2',
					_0: _p31 - 1,
					_1: A3(func, _p31, x, _p30._1)
				};
			});
		return _elm_lang$core$Tuple$second(
			A3(
				_elm_lang$core$List$foldr,
				step,
				{
					ctor: '_Tuple2',
					_0: _elm_lang$core$List$length(list) - 1,
					_1: acc
				},
				list));
	});
var _elm_community$list_extra$List_Extra$indexedFoldl = F3(
	function (func, acc, list) {
		var step = F2(
			function (x, _p32) {
				var _p33 = _p32;
				var _p34 = _p33._0;
				return {
					ctor: '_Tuple2',
					_0: _p34 + 1,
					_1: A3(func, _p34, x, _p33._1)
				};
			});
		return _elm_lang$core$Tuple$second(
			A3(
				_elm_lang$core$List$foldl,
				step,
				{ctor: '_Tuple2', _0: 0, _1: acc},
				list));
	});
var _elm_community$list_extra$List_Extra$foldr1 = F2(
	function (f, xs) {
		var mf = F2(
			function (x, m) {
				return _elm_lang$core$Maybe$Just(
					function () {
						var _p35 = m;
						if (_p35.ctor === 'Nothing') {
							return x;
						} else {
							return A2(f, x, _p35._0);
						}
					}());
			});
		return A3(_elm_lang$core$List$foldr, mf, _elm_lang$core$Maybe$Nothing, xs);
	});
var _elm_community$list_extra$List_Extra$foldl1 = F2(
	function (f, xs) {
		var mf = F2(
			function (x, m) {
				return _elm_lang$core$Maybe$Just(
					function () {
						var _p36 = m;
						if (_p36.ctor === 'Nothing') {
							return x;
						} else {
							return A2(f, _p36._0, x);
						}
					}());
			});
		return A3(_elm_lang$core$List$foldl, mf, _elm_lang$core$Maybe$Nothing, xs);
	});
var _elm_community$list_extra$List_Extra$interweaveHelp = F3(
	function (l1, l2, acc) {
		interweaveHelp:
		while (true) {
			var _p37 = {ctor: '_Tuple2', _0: l1, _1: l2};
			_v23_1:
			do {
				if (_p37._0.ctor === '::') {
					if (_p37._1.ctor === '::') {
						var _v24 = _p37._0._1,
							_v25 = _p37._1._1,
							_v26 = A2(
							_elm_lang$core$Basics_ops['++'],
							acc,
							{
								ctor: '::',
								_0: _p37._0._0,
								_1: {
									ctor: '::',
									_0: _p37._1._0,
									_1: {ctor: '[]'}
								}
							});
						l1 = _v24;
						l2 = _v25;
						acc = _v26;
						continue interweaveHelp;
					} else {
						break _v23_1;
					}
				} else {
					if (_p37._1.ctor === '[]') {
						break _v23_1;
					} else {
						return A2(_elm_lang$core$Basics_ops['++'], acc, _p37._1);
					}
				}
			} while(false);
			return A2(_elm_lang$core$Basics_ops['++'], acc, _p37._0);
		}
	});
var _elm_community$list_extra$List_Extra$interweave = F2(
	function (l1, l2) {
		return A3(
			_elm_community$list_extra$List_Extra$interweaveHelp,
			l1,
			l2,
			{ctor: '[]'});
	});
var _elm_community$list_extra$List_Extra$permutations = function (xs_) {
	var _p38 = xs_;
	if (_p38.ctor === '[]') {
		return {
			ctor: '::',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		};
	} else {
		var f = function (_p39) {
			var _p40 = _p39;
			return A2(
				_elm_lang$core$List$map,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					})(_p40._0),
				_elm_community$list_extra$List_Extra$permutations(_p40._1));
		};
		return A2(
			_elm_lang$core$List$concatMap,
			f,
			_elm_community$list_extra$List_Extra$select(_p38));
	}
};
var _elm_community$list_extra$List_Extra$isPermutationOf = F2(
	function (permut, xs) {
		return A2(
			_elm_lang$core$List$member,
			permut,
			_elm_community$list_extra$List_Extra$permutations(xs));
	});
var _elm_community$list_extra$List_Extra$subsequencesNonEmpty = function (xs) {
	var _p41 = xs;
	if (_p41.ctor === '[]') {
		return {ctor: '[]'};
	} else {
		var _p42 = _p41._0;
		var f = F2(
			function (ys, r) {
				return {
					ctor: '::',
					_0: ys,
					_1: {
						ctor: '::',
						_0: {ctor: '::', _0: _p42, _1: ys},
						_1: r
					}
				};
			});
		return {
			ctor: '::',
			_0: {
				ctor: '::',
				_0: _p42,
				_1: {ctor: '[]'}
			},
			_1: A3(
				_elm_lang$core$List$foldr,
				f,
				{ctor: '[]'},
				_elm_community$list_extra$List_Extra$subsequencesNonEmpty(_p41._1))
		};
	}
};
var _elm_community$list_extra$List_Extra$subsequences = function (xs) {
	return {
		ctor: '::',
		_0: {ctor: '[]'},
		_1: _elm_community$list_extra$List_Extra$subsequencesNonEmpty(xs)
	};
};
var _elm_community$list_extra$List_Extra$isSubsequenceOf = F2(
	function (subseq, xs) {
		return A2(
			_elm_lang$core$List$member,
			subseq,
			_elm_community$list_extra$List_Extra$subsequences(xs));
	});
var _elm_community$list_extra$List_Extra$transpose = function (ll) {
	transpose:
	while (true) {
		var _p43 = ll;
		if (_p43.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			if (_p43._0.ctor === '[]') {
				var _v31 = _p43._1;
				ll = _v31;
				continue transpose;
			} else {
				var _p44 = _p43._1;
				var tails = A2(_elm_lang$core$List$filterMap, _elm_lang$core$List$tail, _p44);
				var heads = A2(_elm_lang$core$List$filterMap, _elm_lang$core$List$head, _p44);
				return {
					ctor: '::',
					_0: {ctor: '::', _0: _p43._0._0, _1: heads},
					_1: _elm_community$list_extra$List_Extra$transpose(
						{ctor: '::', _0: _p43._0._1, _1: tails})
				};
			}
		}
	}
};
var _elm_community$list_extra$List_Extra$intercalate = function (xs) {
	return function (_p45) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$intersperse, xs, _p45));
	};
};
var _elm_community$list_extra$List_Extra$filterNot = F2(
	function (pred, list) {
		return A2(
			_elm_lang$core$List$filter,
			function (_p46) {
				return !pred(_p46);
			},
			list);
	});
var _elm_community$list_extra$List_Extra$removeAt = F2(
	function (index, l) {
		if (_elm_lang$core$Native_Utils.cmp(index, 0) < 0) {
			return l;
		} else {
			var tail = _elm_lang$core$List$tail(
				A2(_elm_lang$core$List$drop, index, l));
			var head = A2(_elm_lang$core$List$take, index, l);
			var _p47 = tail;
			if (_p47.ctor === 'Nothing') {
				return l;
			} else {
				return A2(_elm_lang$core$List$append, head, _p47._0);
			}
		}
	});
var _elm_community$list_extra$List_Extra$singleton = function (x) {
	return {
		ctor: '::',
		_0: x,
		_1: {ctor: '[]'}
	};
};
var _elm_community$list_extra$List_Extra$stableSortWith = F2(
	function (pred, list) {
		var predWithIndex = F2(
			function (_p49, _p48) {
				var _p50 = _p49;
				var _p51 = _p48;
				var result = A2(pred, _p50._0, _p51._0);
				var _p52 = result;
				if (_p52.ctor === 'EQ') {
					return A2(_elm_lang$core$Basics$compare, _p50._1, _p51._1);
				} else {
					return result;
				}
			});
		var listWithIndex = A2(
			_elm_lang$core$List$indexedMap,
			F2(
				function (i, a) {
					return {ctor: '_Tuple2', _0: a, _1: i};
				}),
			list);
		return A2(
			_elm_lang$core$List$map,
			_elm_lang$core$Tuple$first,
			A2(_elm_lang$core$List$sortWith, predWithIndex, listWithIndex));
	});
var _elm_community$list_extra$List_Extra$setAt = F3(
	function (index, value, l) {
		if (_elm_lang$core$Native_Utils.cmp(index, 0) < 0) {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			var tail = _elm_lang$core$List$tail(
				A2(_elm_lang$core$List$drop, index, l));
			var head = A2(_elm_lang$core$List$take, index, l);
			var _p53 = tail;
			if (_p53.ctor === 'Nothing') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				return _elm_lang$core$Maybe$Just(
					A2(
						_elm_lang$core$List$append,
						head,
						{ctor: '::', _0: value, _1: _p53._0}));
			}
		}
	});
var _elm_community$list_extra$List_Extra$remove = F2(
	function (x, xs) {
		var _p54 = xs;
		if (_p54.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var _p56 = _p54._1;
			var _p55 = _p54._0;
			return _elm_lang$core$Native_Utils.eq(x, _p55) ? _p56 : {
				ctor: '::',
				_0: _p55,
				_1: A2(_elm_community$list_extra$List_Extra$remove, x, _p56)
			};
		}
	});
var _elm_community$list_extra$List_Extra$updateIfIndex = F3(
	function (predicate, update, list) {
		return A2(
			_elm_lang$core$List$indexedMap,
			F2(
				function (i, x) {
					return predicate(i) ? update(x) : x;
				}),
			list);
	});
var _elm_community$list_extra$List_Extra$updateAt = F3(
	function (index, update, list) {
		return ((_elm_lang$core$Native_Utils.cmp(index, 0) < 0) || (_elm_lang$core$Native_Utils.cmp(
			index,
			_elm_lang$core$List$length(list)) > -1)) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(
			A3(
				_elm_community$list_extra$List_Extra$updateIfIndex,
				F2(
					function (x, y) {
						return _elm_lang$core$Native_Utils.eq(x, y);
					})(index),
				update,
				list));
	});
var _elm_community$list_extra$List_Extra$updateIf = F3(
	function (predicate, update, list) {
		return A2(
			_elm_lang$core$List$map,
			function (item) {
				return predicate(item) ? update(item) : item;
			},
			list);
	});
var _elm_community$list_extra$List_Extra$replaceIf = F3(
	function (predicate, replacement, list) {
		return A3(
			_elm_community$list_extra$List_Extra$updateIf,
			predicate,
			_elm_lang$core$Basics$always(replacement),
			list);
	});
var _elm_community$list_extra$List_Extra$findIndices = function (p) {
	return function (_p57) {
		return A2(
			_elm_lang$core$List$map,
			_elm_lang$core$Tuple$first,
			A2(
				_elm_lang$core$List$filter,
				function (_p58) {
					var _p59 = _p58;
					return p(_p59._1);
				},
				A2(
					_elm_lang$core$List$indexedMap,
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						}),
					_p57)));
	};
};
var _elm_community$list_extra$List_Extra$findIndex = function (p) {
	return function (_p60) {
		return _elm_lang$core$List$head(
			A2(_elm_community$list_extra$List_Extra$findIndices, p, _p60));
	};
};
var _elm_community$list_extra$List_Extra$elemIndices = function (x) {
	return _elm_community$list_extra$List_Extra$findIndices(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			})(x));
};
var _elm_community$list_extra$List_Extra$elemIndex = function (x) {
	return _elm_community$list_extra$List_Extra$findIndex(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			})(x));
};
var _elm_community$list_extra$List_Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			var _p61 = list;
			if (_p61.ctor === '[]') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p62 = _p61._0;
				if (predicate(_p62)) {
					return _elm_lang$core$Maybe$Just(_p62);
				} else {
					var _v40 = predicate,
						_v41 = _p61._1;
					predicate = _v40;
					list = _v41;
					continue find;
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$notMember = function (x) {
	return function (_p63) {
		return !A2(_elm_lang$core$List$member, x, _p63);
	};
};
var _elm_community$list_extra$List_Extra$andThen = _elm_lang$core$List$concatMap;
var _elm_community$list_extra$List_Extra$lift2 = F3(
	function (f, la, lb) {
		return A2(
			_elm_community$list_extra$List_Extra$andThen,
			function (a) {
				return A2(
					_elm_community$list_extra$List_Extra$andThen,
					function (b) {
						return {
							ctor: '::',
							_0: A2(f, a, b),
							_1: {ctor: '[]'}
						};
					},
					lb);
			},
			la);
	});
var _elm_community$list_extra$List_Extra$lift3 = F4(
	function (f, la, lb, lc) {
		return A2(
			_elm_community$list_extra$List_Extra$andThen,
			function (a) {
				return A2(
					_elm_community$list_extra$List_Extra$andThen,
					function (b) {
						return A2(
							_elm_community$list_extra$List_Extra$andThen,
							function (c) {
								return {
									ctor: '::',
									_0: A3(f, a, b, c),
									_1: {ctor: '[]'}
								};
							},
							lc);
					},
					lb);
			},
			la);
	});
var _elm_community$list_extra$List_Extra$lift4 = F5(
	function (f, la, lb, lc, ld) {
		return A2(
			_elm_community$list_extra$List_Extra$andThen,
			function (a) {
				return A2(
					_elm_community$list_extra$List_Extra$andThen,
					function (b) {
						return A2(
							_elm_community$list_extra$List_Extra$andThen,
							function (c) {
								return A2(
									_elm_community$list_extra$List_Extra$andThen,
									function (d) {
										return {
											ctor: '::',
											_0: A4(f, a, b, c, d),
											_1: {ctor: '[]'}
										};
									},
									ld);
							},
							lc);
					},
					lb);
			},
			la);
	});
var _elm_community$list_extra$List_Extra$andMap = F2(
	function (fl, l) {
		return A3(
			_elm_lang$core$List$map2,
			F2(
				function (x, y) {
					return x(y);
				}),
			fl,
			l);
	});
var _elm_community$list_extra$List_Extra$uniqueHelp = F3(
	function (f, existing, remaining) {
		uniqueHelp:
		while (true) {
			var _p64 = remaining;
			if (_p64.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				var _p66 = _p64._1;
				var _p65 = _p64._0;
				var computedFirst = f(_p65);
				if (A2(_elm_lang$core$Set$member, computedFirst, existing)) {
					var _v43 = f,
						_v44 = existing,
						_v45 = _p66;
					f = _v43;
					existing = _v44;
					remaining = _v45;
					continue uniqueHelp;
				} else {
					return {
						ctor: '::',
						_0: _p65,
						_1: A3(
							_elm_community$list_extra$List_Extra$uniqueHelp,
							f,
							A2(_elm_lang$core$Set$insert, computedFirst, existing),
							_p66)
					};
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$uniqueBy = F2(
	function (f, list) {
		return A3(_elm_community$list_extra$List_Extra$uniqueHelp, f, _elm_lang$core$Set$empty, list);
	});
var _elm_community$list_extra$List_Extra$allDifferentBy = F2(
	function (f, list) {
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(list),
			_elm_lang$core$List$length(
				A2(_elm_community$list_extra$List_Extra$uniqueBy, f, list)));
	});
var _elm_community$list_extra$List_Extra$unique = function (list) {
	return A3(_elm_community$list_extra$List_Extra$uniqueHelp, _elm_lang$core$Basics$identity, _elm_lang$core$Set$empty, list);
};
var _elm_community$list_extra$List_Extra$allDifferent = function (list) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$List$length(list),
		_elm_lang$core$List$length(
			_elm_community$list_extra$List_Extra$unique(list)));
};
var _elm_community$list_extra$List_Extra$dropWhile = F2(
	function (predicate, list) {
		dropWhile:
		while (true) {
			var _p67 = list;
			if (_p67.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				if (predicate(_p67._0)) {
					var _v47 = predicate,
						_v48 = _p67._1;
					predicate = _v47;
					list = _v48;
					continue dropWhile;
				} else {
					return list;
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$takeWhile = F2(
	function (predicate, list) {
		var _p68 = list;
		if (_p68.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var _p69 = _p68._0;
			return predicate(_p69) ? {
				ctor: '::',
				_0: _p69,
				_1: A2(_elm_community$list_extra$List_Extra$takeWhile, predicate, _p68._1)
			} : {ctor: '[]'};
		}
	});
var _elm_community$list_extra$List_Extra$span = F2(
	function (p, xs) {
		return {
			ctor: '_Tuple2',
			_0: A2(_elm_community$list_extra$List_Extra$takeWhile, p, xs),
			_1: A2(_elm_community$list_extra$List_Extra$dropWhile, p, xs)
		};
	});
var _elm_community$list_extra$List_Extra$break = function (p) {
	return _elm_community$list_extra$List_Extra$span(
		function (_p70) {
			return !p(_p70);
		});
};
var _elm_community$list_extra$List_Extra$groupWhile = F2(
	function (eq, xs_) {
		var _p71 = xs_;
		if (_p71.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var _p73 = _p71._0;
			var _p72 = A2(
				_elm_community$list_extra$List_Extra$span,
				eq(_p73),
				_p71._1);
			var ys = _p72._0;
			var zs = _p72._1;
			return {
				ctor: '::',
				_0: {ctor: '::', _0: _p73, _1: ys},
				_1: A2(_elm_community$list_extra$List_Extra$groupWhile, eq, zs)
			};
		}
	});
var _elm_community$list_extra$List_Extra$group = _elm_community$list_extra$List_Extra$groupWhile(
	F2(
		function (x, y) {
			return _elm_lang$core$Native_Utils.eq(x, y);
		}));
var _elm_community$list_extra$List_Extra$minimumBy = F2(
	function (f, ls) {
		var minBy = F2(
			function (x, _p74) {
				var _p75 = _p74;
				var _p76 = _p75._1;
				var fx = f(x);
				return (_elm_lang$core$Native_Utils.cmp(fx, _p76) < 0) ? {ctor: '_Tuple2', _0: x, _1: fx} : {ctor: '_Tuple2', _0: _p75._0, _1: _p76};
			});
		var _p77 = ls;
		if (_p77.ctor === '::') {
			if (_p77._1.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p77._0);
			} else {
				var _p78 = _p77._0;
				return _elm_lang$core$Maybe$Just(
					_elm_lang$core$Tuple$first(
						A3(
							_elm_lang$core$List$foldl,
							minBy,
							{
								ctor: '_Tuple2',
								_0: _p78,
								_1: f(_p78)
							},
							_p77._1)));
			}
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_community$list_extra$List_Extra$maximumBy = F2(
	function (f, ls) {
		var maxBy = F2(
			function (x, _p79) {
				var _p80 = _p79;
				var _p81 = _p80._1;
				var fx = f(x);
				return (_elm_lang$core$Native_Utils.cmp(fx, _p81) > 0) ? {ctor: '_Tuple2', _0: x, _1: fx} : {ctor: '_Tuple2', _0: _p80._0, _1: _p81};
			});
		var _p82 = ls;
		if (_p82.ctor === '::') {
			if (_p82._1.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p82._0);
			} else {
				var _p83 = _p82._0;
				return _elm_lang$core$Maybe$Just(
					_elm_lang$core$Tuple$first(
						A3(
							_elm_lang$core$List$foldl,
							maxBy,
							{
								ctor: '_Tuple2',
								_0: _p83,
								_1: f(_p83)
							},
							_p82._1)));
			}
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_community$list_extra$List_Extra$uncons = function (xs) {
	var _p84 = xs;
	if (_p84.ctor === '[]') {
		return _elm_lang$core$Maybe$Nothing;
	} else {
		return _elm_lang$core$Maybe$Just(
			{ctor: '_Tuple2', _0: _p84._0, _1: _p84._1});
	}
};
var _elm_community$list_extra$List_Extra$swapAt = F3(
	function (index1, index2, l) {
		swapAt:
		while (true) {
			if (_elm_lang$core$Native_Utils.eq(index1, index2)) {
				return _elm_lang$core$Maybe$Just(l);
			} else {
				if (_elm_lang$core$Native_Utils.cmp(index1, index2) > 0) {
					var _v56 = index2,
						_v57 = index1,
						_v58 = l;
					index1 = _v56;
					index2 = _v57;
					l = _v58;
					continue swapAt;
				} else {
					if (_elm_lang$core$Native_Utils.cmp(index1, 0) < 0) {
						return _elm_lang$core$Maybe$Nothing;
					} else {
						var _p85 = A2(_elm_community$list_extra$List_Extra$splitAt, index1, l);
						var part1 = _p85._0;
						var tail1 = _p85._1;
						var _p86 = A2(_elm_community$list_extra$List_Extra$splitAt, index2 - index1, tail1);
						var head2 = _p86._0;
						var tail2 = _p86._1;
						return A3(
							_elm_lang$core$Maybe$map2,
							F2(
								function (_p88, _p87) {
									var _p89 = _p88;
									var _p90 = _p87;
									return _elm_lang$core$List$concat(
										{
											ctor: '::',
											_0: part1,
											_1: {
												ctor: '::',
												_0: {ctor: '::', _0: _p90._0, _1: _p89._1},
												_1: {
													ctor: '::',
													_0: {ctor: '::', _0: _p89._0, _1: _p90._1},
													_1: {ctor: '[]'}
												}
											}
										});
								}),
							_elm_community$list_extra$List_Extra$uncons(head2),
							_elm_community$list_extra$List_Extra$uncons(tail2));
					}
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$iterate = F2(
	function (f, x) {
		var _p91 = f(x);
		if (_p91.ctor === 'Just') {
			return {
				ctor: '::',
				_0: x,
				_1: A2(_elm_community$list_extra$List_Extra$iterate, f, _p91._0)
			};
		} else {
			return {
				ctor: '::',
				_0: x,
				_1: {ctor: '[]'}
			};
		}
	});
var _elm_community$list_extra$List_Extra$getAt = F2(
	function (idx, xs) {
		return (_elm_lang$core$Native_Utils.cmp(idx, 0) < 0) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$List$head(
			A2(_elm_lang$core$List$drop, idx, xs));
	});
var _elm_community$list_extra$List_Extra_ops = _elm_community$list_extra$List_Extra_ops || {};
_elm_community$list_extra$List_Extra_ops['!!'] = _elm_lang$core$Basics$flip(_elm_community$list_extra$List_Extra$getAt);
var _elm_community$list_extra$List_Extra$init = function () {
	var maybe = F2(
		function (d, f) {
			return function (_p92) {
				return A2(
					_elm_lang$core$Maybe$withDefault,
					d,
					A2(_elm_lang$core$Maybe$map, f, _p92));
			};
		});
	return A2(
		_elm_lang$core$List$foldr,
		function (x) {
			return function (_p93) {
				return _elm_lang$core$Maybe$Just(
					A3(
						maybe,
						{ctor: '[]'},
						F2(
							function (x, y) {
								return {ctor: '::', _0: x, _1: y};
							})(x),
						_p93));
			};
		},
		_elm_lang$core$Maybe$Nothing);
}();
var _elm_community$list_extra$List_Extra$last = _elm_community$list_extra$List_Extra$foldl1(
	_elm_lang$core$Basics$flip(_elm_lang$core$Basics$always));

//import Maybe, Native.List //

var _elm_lang$core$Native_Regex = function() {

function escape(str)
{
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function caseInsensitive(re)
{
	return new RegExp(re.source, 'gi');
}
function regex(raw)
{
	return new RegExp(raw, 'g');
}

function contains(re, string)
{
	return string.match(re) !== null;
}

function find(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex === re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		out.push({
			match: result[0],
			submatches: _elm_lang$core$Native_List.fromArray(subs),
			index: result.index,
			number: number
		});
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

function replace(n, re, replacer, string)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		return replacer({
			match: match,
			submatches: _elm_lang$core$Native_List.fromArray(submatches),
			index: arguments[arguments.length - 2],
			number: count
		});
	}
	return string.replace(re, jsReplacer);
}

function split(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	if (n === Infinity)
	{
		return _elm_lang$core$Native_List.fromArray(str.split(re));
	}
	var string = str;
	var result;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		if (!(result = re.exec(string))) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

return {
	regex: regex,
	caseInsensitive: caseInsensitive,
	escape: escape,

	contains: F2(contains),
	find: F3(find),
	replace: F4(replace),
	split: F3(split)
};

}();

var _elm_lang$core$Regex$split = _elm_lang$core$Native_Regex.split;
var _elm_lang$core$Regex$replace = _elm_lang$core$Native_Regex.replace;
var _elm_lang$core$Regex$find = _elm_lang$core$Native_Regex.find;
var _elm_lang$core$Regex$contains = _elm_lang$core$Native_Regex.contains;
var _elm_lang$core$Regex$caseInsensitive = _elm_lang$core$Native_Regex.caseInsensitive;
var _elm_lang$core$Regex$regex = _elm_lang$core$Native_Regex.regex;
var _elm_lang$core$Regex$escape = _elm_lang$core$Native_Regex.escape;
var _elm_lang$core$Regex$Match = F4(
	function (a, b, c, d) {
		return {match: a, submatches: b, index: c, number: d};
	});
var _elm_lang$core$Regex$Regex = {ctor: 'Regex'};
var _elm_lang$core$Regex$AtMost = function (a) {
	return {ctor: 'AtMost', _0: a};
};
var _elm_lang$core$Regex$All = {ctor: 'All'};

var _elm_lang$core$Process$kill = _elm_lang$core$Native_Scheduler.kill;
var _elm_lang$core$Process$sleep = _elm_lang$core$Native_Scheduler.sleep;
var _elm_lang$core$Process$spawn = _elm_lang$core$Native_Scheduler.spawn;

var _elm_lang$dom$Native_Dom = function() {

var fakeNode = {
	addEventListener: function() {},
	removeEventListener: function() {}
};

var onDocument = on(typeof document !== 'undefined' ? document : fakeNode);
var onWindow = on(typeof window !== 'undefined' ? window : fakeNode);

function on(node)
{
	return function(eventName, decoder, toTask)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {

			function performTask(event)
			{
				var result = A2(_elm_lang$core$Json_Decode$decodeValue, decoder, event);
				if (result.ctor === 'Ok')
				{
					_elm_lang$core$Native_Scheduler.rawSpawn(toTask(result._0));
				}
			}

			node.addEventListener(eventName, performTask);

			return function()
			{
				node.removeEventListener(eventName, performTask);
			};
		});
	};
}

var rAF = typeof requestAnimationFrame !== 'undefined'
	? requestAnimationFrame
	: function(callback) { callback(); };

function withNode(id, doStuff)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		rAF(function()
		{
			var node = document.getElementById(id);
			if (node === null)
			{
				callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NotFound', _0: id }));
				return;
			}
			callback(_elm_lang$core$Native_Scheduler.succeed(doStuff(node)));
		});
	});
}


// FOCUS

function focus(id)
{
	return withNode(id, function(node) {
		node.focus();
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function blur(id)
{
	return withNode(id, function(node) {
		node.blur();
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}


// SCROLLING

function getScrollTop(id)
{
	return withNode(id, function(node) {
		return node.scrollTop;
	});
}

function setScrollTop(id, desiredScrollTop)
{
	return withNode(id, function(node) {
		node.scrollTop = desiredScrollTop;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function toBottom(id)
{
	return withNode(id, function(node) {
		node.scrollTop = node.scrollHeight;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function getScrollLeft(id)
{
	return withNode(id, function(node) {
		return node.scrollLeft;
	});
}

function setScrollLeft(id, desiredScrollLeft)
{
	return withNode(id, function(node) {
		node.scrollLeft = desiredScrollLeft;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function toRight(id)
{
	return withNode(id, function(node) {
		node.scrollLeft = node.scrollWidth;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}


// SIZE

function width(options, id)
{
	return withNode(id, function(node) {
		switch (options.ctor)
		{
			case 'Content':
				return node.scrollWidth;
			case 'VisibleContent':
				return node.clientWidth;
			case 'VisibleContentWithBorders':
				return node.offsetWidth;
			case 'VisibleContentWithBordersAndMargins':
				var rect = node.getBoundingClientRect();
				return rect.right - rect.left;
		}
	});
}

function height(options, id)
{
	return withNode(id, function(node) {
		switch (options.ctor)
		{
			case 'Content':
				return node.scrollHeight;
			case 'VisibleContent':
				return node.clientHeight;
			case 'VisibleContentWithBorders':
				return node.offsetHeight;
			case 'VisibleContentWithBordersAndMargins':
				var rect = node.getBoundingClientRect();
				return rect.bottom - rect.top;
		}
	});
}

return {
	onDocument: F3(onDocument),
	onWindow: F3(onWindow),

	focus: focus,
	blur: blur,

	getScrollTop: getScrollTop,
	setScrollTop: F2(setScrollTop),
	getScrollLeft: getScrollLeft,
	setScrollLeft: F2(setScrollLeft),
	toBottom: toBottom,
	toRight: toRight,

	height: F2(height),
	width: F2(width)
};

}();

var _elm_lang$dom$Dom$blur = _elm_lang$dom$Native_Dom.blur;
var _elm_lang$dom$Dom$focus = _elm_lang$dom$Native_Dom.focus;
var _elm_lang$dom$Dom$NotFound = function (a) {
	return {ctor: 'NotFound', _0: a};
};

var _elm_lang$dom$Dom_LowLevel$onWindow = _elm_lang$dom$Native_Dom.onWindow;
var _elm_lang$dom$Dom_LowLevel$onDocument = _elm_lang$dom$Native_Dom.onDocument;

var _elm_lang$virtual_dom$VirtualDom_Debug$wrap;
var _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags;

var _elm_lang$virtual_dom$Native_VirtualDom = function() {

var STYLE_KEY = 'STYLE';
var EVENT_KEY = 'EVENT';
var ATTR_KEY = 'ATTR';
var ATTR_NS_KEY = 'ATTR_NS';

var localDoc = typeof document !== 'undefined' ? document : {};


////////////  VIRTUAL DOM NODES  ////////////


function text(string)
{
	return {
		type: 'text',
		text: string
	};
}


function node(tag)
{
	return F2(function(factList, kidList) {
		return nodeHelp(tag, factList, kidList);
	});
}


function nodeHelp(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function keyedNode(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid._1.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'keyed-node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function custom(factList, model, impl)
{
	var facts = organizeFacts(factList).facts;

	return {
		type: 'custom',
		facts: facts,
		model: model,
		impl: impl
	};
}


function map(tagger, node)
{
	return {
		type: 'tagger',
		tagger: tagger,
		node: node,
		descendantsCount: 1 + (node.descendantsCount || 0)
	};
}


function thunk(func, args, thunk)
{
	return {
		type: 'thunk',
		func: func,
		args: args,
		thunk: thunk,
		node: undefined
	};
}

function lazy(fn, a)
{
	return thunk(fn, [a], function() {
		return fn(a);
	});
}

function lazy2(fn, a, b)
{
	return thunk(fn, [a,b], function() {
		return A2(fn, a, b);
	});
}

function lazy3(fn, a, b, c)
{
	return thunk(fn, [a,b,c], function() {
		return A3(fn, a, b, c);
	});
}



// FACTS


function organizeFacts(factList)
{
	var namespace, facts = {};

	while (factList.ctor !== '[]')
	{
		var entry = factList._0;
		var key = entry.key;

		if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY)
		{
			var subFacts = facts[key] || {};
			subFacts[entry.realKey] = entry.value;
			facts[key] = subFacts;
		}
		else if (key === STYLE_KEY)
		{
			var styles = facts[key] || {};
			var styleList = entry.value;
			while (styleList.ctor !== '[]')
			{
				var style = styleList._0;
				styles[style._0] = style._1;
				styleList = styleList._1;
			}
			facts[key] = styles;
		}
		else if (key === 'namespace')
		{
			namespace = entry.value;
		}
		else if (key === 'className')
		{
			var classes = facts[key];
			facts[key] = typeof classes === 'undefined'
				? entry.value
				: classes + ' ' + entry.value;
		}
 		else
		{
			facts[key] = entry.value;
		}
		factList = factList._1;
	}

	return {
		facts: facts,
		namespace: namespace
	};
}



////////////  PROPERTIES AND ATTRIBUTES  ////////////


function style(value)
{
	return {
		key: STYLE_KEY,
		value: value
	};
}


function property(key, value)
{
	return {
		key: key,
		value: value
	};
}


function attribute(key, value)
{
	return {
		key: ATTR_KEY,
		realKey: key,
		value: value
	};
}


function attributeNS(namespace, key, value)
{
	return {
		key: ATTR_NS_KEY,
		realKey: key,
		value: {
			value: value,
			namespace: namespace
		}
	};
}


function on(name, options, decoder)
{
	return {
		key: EVENT_KEY,
		realKey: name,
		value: {
			options: options,
			decoder: decoder
		}
	};
}


function equalEvents(a, b)
{
	if (a.options !== b.options)
	{
		if (a.options.stopPropagation !== b.options.stopPropagation || a.options.preventDefault !== b.options.preventDefault)
		{
			return false;
		}
	}
	return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
}


function mapProperty(func, property)
{
	if (property.key !== EVENT_KEY)
	{
		return property;
	}
	return on(
		property.realKey,
		property.value.options,
		A2(_elm_lang$core$Json_Decode$map, func, property.value.decoder)
	);
}


////////////  RENDER  ////////////


function render(vNode, eventNode)
{
	switch (vNode.type)
	{
		case 'thunk':
			if (!vNode.node)
			{
				vNode.node = vNode.thunk();
			}
			return render(vNode.node, eventNode);

		case 'tagger':
			var subNode = vNode.node;
			var tagger = vNode.tagger;

			while (subNode.type === 'tagger')
			{
				typeof tagger !== 'object'
					? tagger = [tagger, subNode.tagger]
					: tagger.push(subNode.tagger);

				subNode = subNode.node;
			}

			var subEventRoot = { tagger: tagger, parent: eventNode };
			var domNode = render(subNode, subEventRoot);
			domNode.elm_event_node_ref = subEventRoot;
			return domNode;

		case 'text':
			return localDoc.createTextNode(vNode.text);

		case 'node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i], eventNode));
			}

			return domNode;

		case 'keyed-node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i]._1, eventNode));
			}

			return domNode;

		case 'custom':
			var domNode = vNode.impl.render(vNode.model);
			applyFacts(domNode, eventNode, vNode.facts);
			return domNode;
	}
}



////////////  APPLY FACTS  ////////////


function applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		switch (key)
		{
			case STYLE_KEY:
				applyStyles(domNode, value);
				break;

			case EVENT_KEY:
				applyEvents(domNode, eventNode, value);
				break;

			case ATTR_KEY:
				applyAttrs(domNode, value);
				break;

			case ATTR_NS_KEY:
				applyAttrsNS(domNode, value);
				break;

			case 'value':
				if (domNode[key] !== value)
				{
					domNode[key] = value;
				}
				break;

			default:
				domNode[key] = value;
				break;
		}
	}
}

function applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}

function applyEvents(domNode, eventNode, events)
{
	var allHandlers = domNode.elm_handlers || {};

	for (var key in events)
	{
		var handler = allHandlers[key];
		var value = events[key];

		if (typeof value === 'undefined')
		{
			domNode.removeEventListener(key, handler);
			allHandlers[key] = undefined;
		}
		else if (typeof handler === 'undefined')
		{
			var handler = makeEventHandler(eventNode, value);
			domNode.addEventListener(key, handler);
			allHandlers[key] = handler;
		}
		else
		{
			handler.info = value;
		}
	}

	domNode.elm_handlers = allHandlers;
}

function makeEventHandler(eventNode, info)
{
	function eventHandler(event)
	{
		var info = eventHandler.info;

		var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

		if (value.ctor === 'Ok')
		{
			var options = info.options;
			if (options.stopPropagation)
			{
				event.stopPropagation();
			}
			if (options.preventDefault)
			{
				event.preventDefault();
			}

			var message = value._0;

			var currentEventNode = eventNode;
			while (currentEventNode)
			{
				var tagger = currentEventNode.tagger;
				if (typeof tagger === 'function')
				{
					message = tagger(message);
				}
				else
				{
					for (var i = tagger.length; i--; )
					{
						message = tagger[i](message);
					}
				}
				currentEventNode = currentEventNode.parent;
			}
		}
	};

	eventHandler.info = info;

	return eventHandler;
}

function applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		if (typeof value === 'undefined')
		{
			domNode.removeAttribute(key);
		}
		else
		{
			domNode.setAttribute(key, value);
		}
	}
}

function applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.namespace;
		var value = pair.value;

		if (typeof value === 'undefined')
		{
			domNode.removeAttributeNS(namespace, key);
		}
		else
		{
			domNode.setAttributeNS(namespace, key, value);
		}
	}
}



////////////  DIFF  ////////////


function diff(a, b)
{
	var patches = [];
	diffHelp(a, b, patches, 0);
	return patches;
}


function makePatch(type, index, data)
{
	return {
		index: index,
		type: type,
		data: data,
		domNode: undefined,
		eventNode: undefined
	};
}


function diffHelp(a, b, patches, index)
{
	if (a === b)
	{
		return;
	}

	var aType = a.type;
	var bType = b.type;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (aType !== bType)
	{
		patches.push(makePatch('p-redraw', index, b));
		return;
	}

	// Now we know that both nodes are the same type.
	switch (bType)
	{
		case 'thunk':
			var aArgs = a.args;
			var bArgs = b.args;
			var i = aArgs.length;
			var same = a.func === b.func && i === bArgs.length;
			while (same && i--)
			{
				same = aArgs[i] === bArgs[i];
			}
			if (same)
			{
				b.node = a.node;
				return;
			}
			b.node = b.thunk();
			var subPatches = [];
			diffHelp(a.node, b.node, subPatches, 0);
			if (subPatches.length > 0)
			{
				patches.push(makePatch('p-thunk', index, subPatches));
			}
			return;

		case 'tagger':
			// gather nested taggers
			var aTaggers = a.tagger;
			var bTaggers = b.tagger;
			var nesting = false;

			var aSubNode = a.node;
			while (aSubNode.type === 'tagger')
			{
				nesting = true;

				typeof aTaggers !== 'object'
					? aTaggers = [aTaggers, aSubNode.tagger]
					: aTaggers.push(aSubNode.tagger);

				aSubNode = aSubNode.node;
			}

			var bSubNode = b.node;
			while (bSubNode.type === 'tagger')
			{
				nesting = true;

				typeof bTaggers !== 'object'
					? bTaggers = [bTaggers, bSubNode.tagger]
					: bTaggers.push(bSubNode.tagger);

				bSubNode = bSubNode.node;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && aTaggers.length !== bTaggers.length)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers)
			{
				patches.push(makePatch('p-tagger', index, bTaggers));
			}

			// diff everything below the taggers
			diffHelp(aSubNode, bSubNode, patches, index + 1);
			return;

		case 'text':
			if (a.text !== b.text)
			{
				patches.push(makePatch('p-text', index, b.text));
				return;
			}

			return;

		case 'node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffChildren(a, b, patches, index);
			return;

		case 'keyed-node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffKeyedChildren(a, b, patches, index);
			return;

		case 'custom':
			if (a.impl !== b.impl)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);
			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			var patch = b.impl.diff(a,b);
			if (patch)
			{
				patches.push(makePatch('p-custom', index, patch));
				return;
			}

			return;
	}
}


// assumes the incoming arrays are the same length
function pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function diffFacts(a, b, category)
{
	var diff;

	// look for changes and removals
	for (var aKey in a)
	{
		if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY)
		{
			var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[aKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(aKey in b))
		{
			diff = diff || {};
			diff[aKey] =
				(typeof category === 'undefined')
					? (typeof a[aKey] === 'string' ? '' : null)
					:
				(category === STYLE_KEY)
					? ''
					:
				(category === EVENT_KEY || category === ATTR_KEY)
					? undefined
					:
				{ namespace: a[aKey].namespace, value: undefined };

			continue;
		}

		var aValue = a[aKey];
		var bValue = b[aKey];

		// reference equal, so don't worry about it
		if (aValue === bValue && aKey !== 'value'
			|| category === EVENT_KEY && equalEvents(aValue, bValue))
		{
			continue;
		}

		diff = diff || {};
		diff[aKey] = bValue;
	}

	// add new stuff
	for (var bKey in b)
	{
		if (!(bKey in a))
		{
			diff = diff || {};
			diff[bKey] = b[bKey];
		}
	}

	return diff;
}


function diffChildren(aParent, bParent, patches, rootIndex)
{
	var aChildren = aParent.children;
	var bChildren = bParent.children;

	var aLen = aChildren.length;
	var bLen = bChildren.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (aLen > bLen)
	{
		patches.push(makePatch('p-remove-last', rootIndex, aLen - bLen));
	}
	else if (aLen < bLen)
	{
		patches.push(makePatch('p-append', rootIndex, bChildren.slice(aLen)));
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	var index = rootIndex;
	var minLen = aLen < bLen ? aLen : bLen;
	for (var i = 0; i < minLen; i++)
	{
		index++;
		var aChild = aChildren[i];
		diffHelp(aChild, bChildren[i], patches, index);
		index += aChild.descendantsCount || 0;
	}
}



////////////  KEYED DIFF  ////////////


function diffKeyedChildren(aParent, bParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var aChildren = aParent.children;
	var bChildren = bParent.children;
	var aLen = aChildren.length;
	var bLen = bChildren.length;
	var aIndex = 0;
	var bIndex = 0;

	var index = rootIndex;

	while (aIndex < aLen && bIndex < bLen)
	{
		var a = aChildren[aIndex];
		var b = bChildren[bIndex];

		var aKey = a._0;
		var bKey = b._0;
		var aNode = a._1;
		var bNode = b._1;

		// check if keys match

		if (aKey === bKey)
		{
			index++;
			diffHelp(aNode, bNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex++;
			bIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var aLookAhead = aIndex + 1 < aLen;
		var bLookAhead = bIndex + 1 < bLen;

		if (aLookAhead)
		{
			var aNext = aChildren[aIndex + 1];
			var aNextKey = aNext._0;
			var aNextNode = aNext._1;
			var oldMatch = bKey === aNextKey;
		}

		if (bLookAhead)
		{
			var bNext = bChildren[bIndex + 1];
			var bNextKey = bNext._0;
			var bNextNode = bNext._1;
			var newMatch = aKey === bNextKey;
		}


		// swap a and b
		if (aLookAhead && bLookAhead && newMatch && oldMatch)
		{
			index++;
			diffHelp(aNode, bNextNode, localPatches, index);
			insertNode(changes, localPatches, aKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			removeNode(changes, localPatches, aKey, aNextNode, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		// insert b
		if (bLookAhead && newMatch)
		{
			index++;
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			diffHelp(aNode, bNextNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex += 1;
			bIndex += 2;
			continue;
		}

		// remove a
		if (aLookAhead && oldMatch)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 1;
			continue;
		}

		// remove a, insert b
		if (aLookAhead && bLookAhead && aNextKey === bNextKey)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNextNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (aIndex < aLen)
	{
		index++;
		var a = aChildren[aIndex];
		var aNode = a._1;
		removeNode(changes, localPatches, a._0, aNode, index);
		index += aNode.descendantsCount || 0;
		aIndex++;
	}

	var endInserts;
	while (bIndex < bLen)
	{
		endInserts = endInserts || [];
		var b = bChildren[bIndex];
		insertNode(changes, localPatches, b._0, b._1, undefined, endInserts);
		bIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || typeof endInserts !== 'undefined')
	{
		patches.push(makePatch('p-reorder', rootIndex, {
			patches: localPatches,
			inserts: inserts,
			endInserts: endInserts
		}));
	}
}



////////////  CHANGES FROM KEYED DIFF  ////////////


var POSTFIX = '_elmW6BL';


function insertNode(changes, localPatches, key, vnode, bIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		entry = {
			tag: 'insert',
			vnode: vnode,
			index: bIndex,
			data: undefined
		};

		inserts.push({ index: bIndex, entry: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.tag === 'remove')
	{
		inserts.push({ index: bIndex, entry: entry });

		entry.tag = 'move';
		var subPatches = [];
		diffHelp(entry.vnode, vnode, subPatches, entry.index);
		entry.index = bIndex;
		entry.data.data = {
			patches: subPatches,
			entry: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	insertNode(changes, localPatches, key + POSTFIX, vnode, bIndex, inserts);
}


function removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		var patch = makePatch('p-remove', index, undefined);
		localPatches.push(patch);

		changes[key] = {
			tag: 'remove',
			vnode: vnode,
			index: index,
			data: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.tag === 'insert')
	{
		entry.tag = 'move';
		var subPatches = [];
		diffHelp(vnode, entry.vnode, subPatches, index);

		var patch = makePatch('p-remove', index, {
			patches: subPatches,
			entry: entry
		});
		localPatches.push(patch);

		return;
	}

	// this key has already been removed or moved, a duplicate!
	removeNode(changes, localPatches, key + POSTFIX, vnode, index);
}



////////////  ADD DOM NODES  ////////////
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function addDomNodes(domNode, vNode, patches, eventNode)
{
	addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.index;

	while (index === low)
	{
		var patchType = patch.type;

		if (patchType === 'p-thunk')
		{
			addDomNodes(domNode, vNode.node, patch.data, eventNode);
		}
		else if (patchType === 'p-reorder')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var subPatches = patch.data.patches;
			if (subPatches.length > 0)
			{
				addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 'p-remove')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var data = patch.data;
			if (typeof data !== 'undefined')
			{
				data.entry.data = domNode;
				var subPatches = data.patches;
				if (subPatches.length > 0)
				{
					addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.index) > high)
		{
			return i;
		}
	}

	switch (vNode.type)
	{
		case 'tagger':
			var subNode = vNode.node;

			while (subNode.type === "tagger")
			{
				subNode = subNode.node;
			}

			return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

		case 'node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j];
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'keyed-node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j]._1;
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'text':
		case 'thunk':
			throw new Error('should never traverse `text` or `thunk` nodes like this');
	}
}



////////////  APPLY PATCHES  ////////////


function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return applyPatchesHelp(rootDomNode, patches);
}

function applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.domNode
		var newNode = applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function applyPatch(domNode, patch)
{
	switch (patch.type)
	{
		case 'p-redraw':
			return applyPatchRedraw(domNode, patch.data, patch.eventNode);

		case 'p-facts':
			applyFacts(domNode, patch.eventNode, patch.data);
			return domNode;

		case 'p-text':
			domNode.replaceData(0, domNode.length, patch.data);
			return domNode;

		case 'p-thunk':
			return applyPatchesHelp(domNode, patch.data);

		case 'p-tagger':
			if (typeof domNode.elm_event_node_ref !== 'undefined')
			{
				domNode.elm_event_node_ref.tagger = patch.data;
			}
			else
			{
				domNode.elm_event_node_ref = { tagger: patch.data, parent: patch.eventNode };
			}
			return domNode;

		case 'p-remove-last':
			var i = patch.data;
			while (i--)
			{
				domNode.removeChild(domNode.lastChild);
			}
			return domNode;

		case 'p-append':
			var newNodes = patch.data;
			for (var i = 0; i < newNodes.length; i++)
			{
				domNode.appendChild(render(newNodes[i], patch.eventNode));
			}
			return domNode;

		case 'p-remove':
			var data = patch.data;
			if (typeof data === 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.entry;
			if (typeof entry.index !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.data = applyPatchesHelp(domNode, data.patches);
			return domNode;

		case 'p-reorder':
			return applyPatchReorder(domNode, patch);

		case 'p-custom':
			var impl = patch.data;
			return impl.applyPatch(domNode, impl.data);

		default:
			throw new Error('Ran into an unknown patch!');
	}
}


function applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = render(vNode, eventNode);

	if (typeof newNode.elm_event_node_ref === 'undefined')
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function applyPatchReorder(domNode, patch)
{
	var data = patch.data;

	// remove end inserts
	var frag = applyPatchReorderEndInsertsHelp(data.endInserts, patch);

	// removals
	domNode = applyPatchesHelp(domNode, data.patches);

	// inserts
	var inserts = data.inserts;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.entry;
		var node = entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode);
		domNode.insertBefore(node, domNode.childNodes[insert.index]);
	}

	// add end inserts
	if (typeof frag !== 'undefined')
	{
		domNode.appendChild(frag);
	}

	return domNode;
}


function applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (typeof endInserts === 'undefined')
	{
		return;
	}

	var frag = localDoc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.entry;
		frag.appendChild(entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode)
		);
	}
	return frag;
}


// PROGRAMS

var program = makeProgram(checkNoFlags);
var programWithFlags = makeProgram(checkYesFlags);

function makeProgram(flagChecker)
{
	return F2(function(debugWrap, impl)
	{
		return function(flagDecoder)
		{
			return function(object, moduleName, debugMetadata)
			{
				var checker = flagChecker(flagDecoder, moduleName);
				if (typeof debugMetadata === 'undefined')
				{
					normalSetup(impl, object, moduleName, checker);
				}
				else
				{
					debugSetup(A2(debugWrap, debugMetadata, impl), object, moduleName, checker);
				}
			};
		};
	});
}

function staticProgram(vNode)
{
	var nothing = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		_elm_lang$core$Platform_Cmd$none
	);
	return A2(program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, {
		init: nothing,
		view: function() { return vNode; },
		update: F2(function() { return nothing; }),
		subscriptions: function() { return _elm_lang$core$Platform_Sub$none; }
	})();
}


// FLAG CHECKERS

function checkNoFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flags === 'undefined')
		{
			return init;
		}

		var errorMessage =
			'The `' + moduleName + '` module does not need flags.\n'
			+ 'Initialize it with no arguments and you should be all set!';

		crash(errorMessage, domNode);
	};
}

function checkYesFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flagDecoder === 'undefined')
		{
			var errorMessage =
				'Are you trying to sneak a Never value into Elm? Trickster!\n'
				+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
				+ 'Use `program` instead if you do not want flags.'

			crash(errorMessage, domNode);
		}

		var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
		if (result.ctor === 'Ok')
		{
			return init(result._0);
		}

		var errorMessage =
			'Trying to initialize the `' + moduleName + '` module with an unexpected flag.\n'
			+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
			+ result._0;

		crash(errorMessage, domNode);
	};
}

function crash(errorMessage, domNode)
{
	if (domNode)
	{
		domNode.innerHTML =
			'<div style="padding-left:1em;">'
			+ '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>'
			+ '<pre style="padding-left:1em;">' + errorMessage + '</pre>'
			+ '</div>';
	}

	throw new Error(errorMessage);
}


//  NORMAL SETUP

function normalSetup(impl, object, moduleName, flagChecker)
{
	object['embed'] = function embed(node, flags)
	{
		while (node.lastChild)
		{
			node.removeChild(node.lastChild);
		}

		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update,
			impl.subscriptions,
			normalRenderer(node, impl.view)
		);
	};

	object['fullscreen'] = function fullscreen(flags)
	{
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update,
			impl.subscriptions,
			normalRenderer(document.body, impl.view)
		);
	};
}

function normalRenderer(parentNode, view)
{
	return function(tagger, initialModel)
	{
		var eventNode = { tagger: tagger, parent: undefined };
		var initialVirtualNode = view(initialModel);
		var domNode = render(initialVirtualNode, eventNode);
		parentNode.appendChild(domNode);
		return makeStepper(domNode, view, initialVirtualNode, eventNode);
	};
}


// STEPPER

var rAF =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { setTimeout(callback, 1000 / 60); };

function makeStepper(domNode, view, initialVirtualNode, eventNode)
{
	var state = 'NO_REQUEST';
	var currNode = initialVirtualNode;
	var nextModel;

	function updateIfNeeded()
	{
		switch (state)
		{
			case 'NO_REQUEST':
				throw new Error(
					'Unexpected draw callback.\n' +
					'Please report this to <https://github.com/elm-lang/virtual-dom/issues>.'
				);

			case 'PENDING_REQUEST':
				rAF(updateIfNeeded);
				state = 'EXTRA_REQUEST';

				var nextNode = view(nextModel);
				var patches = diff(currNode, nextNode);
				domNode = applyPatches(domNode, currNode, patches, eventNode);
				currNode = nextNode;

				return;

			case 'EXTRA_REQUEST':
				state = 'NO_REQUEST';
				return;
		}
	}

	return function stepper(model)
	{
		if (state === 'NO_REQUEST')
		{
			rAF(updateIfNeeded);
		}
		state = 'PENDING_REQUEST';
		nextModel = model;
	};
}


// DEBUG SETUP

function debugSetup(impl, object, moduleName, flagChecker)
{
	object['fullscreen'] = function fullscreen(flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, document.body, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};

	object['embed'] = function fullscreen(node, flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, node, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};
}

function scrollTask(popoutRef)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var doc = popoutRef.doc;
		if (doc)
		{
			var msgs = doc.getElementsByClassName('debugger-sidebar-messages')[0];
			if (msgs)
			{
				msgs.scrollTop = msgs.scrollHeight;
			}
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}


function debugRenderer(moduleName, parentNode, popoutRef, view, viewIn, viewOut)
{
	return function(tagger, initialModel)
	{
		var appEventNode = { tagger: tagger, parent: undefined };
		var eventNode = { tagger: tagger, parent: undefined };

		// make normal stepper
		var appVirtualNode = view(initialModel);
		var appNode = render(appVirtualNode, appEventNode);
		parentNode.appendChild(appNode);
		var appStepper = makeStepper(appNode, view, appVirtualNode, appEventNode);

		// make overlay stepper
		var overVirtualNode = viewIn(initialModel)._1;
		var overNode = render(overVirtualNode, eventNode);
		parentNode.appendChild(overNode);
		var wrappedViewIn = wrapViewIn(appEventNode, overNode, viewIn);
		var overStepper = makeStepper(overNode, wrappedViewIn, overVirtualNode, eventNode);

		// make debugger stepper
		var debugStepper = makeDebugStepper(initialModel, viewOut, eventNode, parentNode, moduleName, popoutRef);

		return function stepper(model)
		{
			appStepper(model);
			overStepper(model);
			debugStepper(model);
		}
	};
}

function makeDebugStepper(initialModel, view, eventNode, parentNode, moduleName, popoutRef)
{
	var curr;
	var domNode;

	return function stepper(model)
	{
		if (!model.isDebuggerOpen)
		{
			return;
		}

		if (!popoutRef.doc)
		{
			curr = view(model);
			domNode = openDebugWindow(moduleName, popoutRef, curr, eventNode);
			return;
		}

		// switch to document of popout
		localDoc = popoutRef.doc;

		var next = view(model);
		var patches = diff(curr, next);
		domNode = applyPatches(domNode, curr, patches, eventNode);
		curr = next;

		// switch back to normal document
		localDoc = document;
	};
}

function openDebugWindow(moduleName, popoutRef, virtualNode, eventNode)
{
	var w = 900;
	var h = 360;
	var x = screen.width - w;
	var y = screen.height - h;
	var debugWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);

	// switch to window document
	localDoc = debugWindow.document;

	popoutRef.doc = localDoc;
	localDoc.title = 'Debugger - ' + moduleName;
	localDoc.body.style.margin = '0';
	localDoc.body.style.padding = '0';
	var domNode = render(virtualNode, eventNode);
	localDoc.body.appendChild(domNode);

	localDoc.addEventListener('keydown', function(event) {
		if (event.metaKey && event.which === 82)
		{
			window.location.reload();
		}
		if (event.which === 38)
		{
			eventNode.tagger({ ctor: 'Up' });
			event.preventDefault();
		}
		if (event.which === 40)
		{
			eventNode.tagger({ ctor: 'Down' });
			event.preventDefault();
		}
	});

	function close()
	{
		popoutRef.doc = undefined;
		debugWindow.close();
	}
	window.addEventListener('unload', close);
	debugWindow.addEventListener('unload', function() {
		popoutRef.doc = undefined;
		window.removeEventListener('unload', close);
		eventNode.tagger({ ctor: 'Close' });
	});

	// switch back to the normal document
	localDoc = document;

	return domNode;
}


// BLOCK EVENTS

function wrapViewIn(appEventNode, overlayNode, viewIn)
{
	var ignorer = makeIgnorer(overlayNode);
	var blocking = 'Normal';
	var overflow;

	var normalTagger = appEventNode.tagger;
	var blockTagger = function() {};

	return function(model)
	{
		var tuple = viewIn(model);
		var newBlocking = tuple._0.ctor;
		appEventNode.tagger = newBlocking === 'Normal' ? normalTagger : blockTagger;
		if (blocking !== newBlocking)
		{
			traverse('removeEventListener', ignorer, blocking);
			traverse('addEventListener', ignorer, newBlocking);

			if (blocking === 'Normal')
			{
				overflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
			}

			if (newBlocking === 'Normal')
			{
				document.body.style.overflow = overflow;
			}

			blocking = newBlocking;
		}
		return tuple._1;
	}
}

function traverse(verbEventListener, ignorer, blocking)
{
	switch(blocking)
	{
		case 'Normal':
			return;

		case 'Pause':
			return traverseHelp(verbEventListener, ignorer, mostEvents);

		case 'Message':
			return traverseHelp(verbEventListener, ignorer, allEvents);
	}
}

function traverseHelp(verbEventListener, handler, eventNames)
{
	for (var i = 0; i < eventNames.length; i++)
	{
		document.body[verbEventListener](eventNames[i], handler, true);
	}
}

function makeIgnorer(overlayNode)
{
	return function(event)
	{
		if (event.type === 'keydown' && event.metaKey && event.which === 82)
		{
			return;
		}

		var isScroll = event.type === 'scroll' || event.type === 'wheel';

		var node = event.target;
		while (node !== null)
		{
			if (node.className === 'elm-overlay-message-details' && isScroll)
			{
				return;
			}

			if (node === overlayNode && !isScroll)
			{
				return;
			}
			node = node.parentNode;
		}

		event.stopPropagation();
		event.preventDefault();
	}
}

var mostEvents = [
	'click', 'dblclick', 'mousemove',
	'mouseup', 'mousedown', 'mouseenter', 'mouseleave',
	'touchstart', 'touchend', 'touchcancel', 'touchmove',
	'pointerdown', 'pointerup', 'pointerover', 'pointerout',
	'pointerenter', 'pointerleave', 'pointermove', 'pointercancel',
	'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
	'keyup', 'keydown', 'keypress',
	'input', 'change',
	'focus', 'blur'
];

var allEvents = mostEvents.concat('wheel', 'scroll');


return {
	node: node,
	text: text,
	custom: custom,
	map: F2(map),

	on: F3(on),
	style: style,
	property: F2(property),
	attribute: F2(attribute),
	attributeNS: F3(attributeNS),
	mapProperty: F2(mapProperty),

	lazy: F2(lazy),
	lazy2: F3(lazy2),
	lazy3: F4(lazy3),
	keyedNode: F3(keyedNode),

	program: program,
	programWithFlags: programWithFlags,
	staticProgram: staticProgram
};

}();

var _elm_lang$virtual_dom$VirtualDom$programWithFlags = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.programWithFlags, _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags, impl);
};
var _elm_lang$virtual_dom$VirtualDom$program = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, impl);
};
var _elm_lang$virtual_dom$VirtualDom$keyedNode = _elm_lang$virtual_dom$Native_VirtualDom.keyedNode;
var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
var _elm_lang$virtual_dom$VirtualDom$defaultOptions = {stopPropagation: false, preventDefault: false};
var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
var _elm_lang$virtual_dom$VirtualDom$on = F2(
	function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
var _elm_lang$virtual_dom$VirtualDom$mapProperty = _elm_lang$virtual_dom$Native_VirtualDom.mapProperty;
var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
var _elm_lang$virtual_dom$VirtualDom$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});
var _elm_lang$virtual_dom$VirtualDom$Node = {ctor: 'Node'};
var _elm_lang$virtual_dom$VirtualDom$Property = {ctor: 'Property'};

var _elm_lang$html$Html$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
var _elm_lang$html$Html$program = _elm_lang$virtual_dom$VirtualDom$program;
var _elm_lang$html$Html$beginnerProgram = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$html$Html$program(
		{
			init: A2(
				_elm_lang$core$Platform_Cmd_ops['!'],
				_p1.model,
				{ctor: '[]'}),
			update: F2(
				function (msg, model) {
					return A2(
						_elm_lang$core$Platform_Cmd_ops['!'],
						A2(_p1.update, msg, model),
						{ctor: '[]'});
				}),
			view: _p1.view,
			subscriptions: function (_p2) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
};
var _elm_lang$html$Html$map = _elm_lang$virtual_dom$VirtualDom$map;
var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
var _elm_lang$html$Html$main_ = _elm_lang$html$Html$node('main');
var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

var _elm_lang$html$Html_Attributes$map = _elm_lang$virtual_dom$VirtualDom$mapProperty;
var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
var _elm_lang$html$Html_Attributes$contextmenu = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
};
var _elm_lang$html$Html_Attributes$draggable = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'draggable', value);
};
var _elm_lang$html$Html_Attributes$itemprop = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'itemprop', value);
};
var _elm_lang$html$Html_Attributes$tabindex = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'tabIndex',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$charset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'charset', value);
};
var _elm_lang$html$Html_Attributes$height = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'height',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$width = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'width',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$formaction = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'formAction', value);
};
var _elm_lang$html$Html_Attributes$list = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'list', value);
};
var _elm_lang$html$Html_Attributes$minlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'minLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$maxlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'maxlength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$size = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'size',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$form = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'form', value);
};
var _elm_lang$html$Html_Attributes$cols = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'cols',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rows = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rows',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$challenge = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'challenge', value);
};
var _elm_lang$html$Html_Attributes$media = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'media', value);
};
var _elm_lang$html$Html_Attributes$rel = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'rel', value);
};
var _elm_lang$html$Html_Attributes$datetime = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'datetime', value);
};
var _elm_lang$html$Html_Attributes$pubdate = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'pubdate', value);
};
var _elm_lang$html$Html_Attributes$colspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'colspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rowspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rowspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$manifest = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'manifest', value);
};
var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
var _elm_lang$html$Html_Attributes$stringProperty = F2(
	function (name, string) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$string(string));
	});
var _elm_lang$html$Html_Attributes$class = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
};
var _elm_lang$html$Html_Attributes$id = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
};
var _elm_lang$html$Html_Attributes$title = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
};
var _elm_lang$html$Html_Attributes$accesskey = function ($char) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'accessKey',
		_elm_lang$core$String$fromChar($char));
};
var _elm_lang$html$Html_Attributes$dir = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
};
var _elm_lang$html$Html_Attributes$dropzone = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
};
var _elm_lang$html$Html_Attributes$lang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
};
var _elm_lang$html$Html_Attributes$content = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
};
var _elm_lang$html$Html_Attributes$httpEquiv = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
};
var _elm_lang$html$Html_Attributes$language = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
};
var _elm_lang$html$Html_Attributes$src = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
};
var _elm_lang$html$Html_Attributes$alt = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
};
var _elm_lang$html$Html_Attributes$preload = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
};
var _elm_lang$html$Html_Attributes$poster = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
};
var _elm_lang$html$Html_Attributes$kind = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
};
var _elm_lang$html$Html_Attributes$srclang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
};
var _elm_lang$html$Html_Attributes$sandbox = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
};
var _elm_lang$html$Html_Attributes$srcdoc = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
};
var _elm_lang$html$Html_Attributes$type_ = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
};
var _elm_lang$html$Html_Attributes$value = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
};
var _elm_lang$html$Html_Attributes$defaultValue = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
};
var _elm_lang$html$Html_Attributes$placeholder = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
};
var _elm_lang$html$Html_Attributes$accept = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
};
var _elm_lang$html$Html_Attributes$acceptCharset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
};
var _elm_lang$html$Html_Attributes$action = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
};
var _elm_lang$html$Html_Attributes$autocomplete = function (bool) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var _elm_lang$html$Html_Attributes$enctype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
};
var _elm_lang$html$Html_Attributes$method = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
};
var _elm_lang$html$Html_Attributes$name = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
};
var _elm_lang$html$Html_Attributes$pattern = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
};
var _elm_lang$html$Html_Attributes$for = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
};
var _elm_lang$html$Html_Attributes$max = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
};
var _elm_lang$html$Html_Attributes$min = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
};
var _elm_lang$html$Html_Attributes$step = function (n) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
};
var _elm_lang$html$Html_Attributes$wrap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
};
var _elm_lang$html$Html_Attributes$usemap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
};
var _elm_lang$html$Html_Attributes$shape = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
};
var _elm_lang$html$Html_Attributes$coords = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
};
var _elm_lang$html$Html_Attributes$keytype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
};
var _elm_lang$html$Html_Attributes$align = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
};
var _elm_lang$html$Html_Attributes$cite = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
};
var _elm_lang$html$Html_Attributes$href = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
};
var _elm_lang$html$Html_Attributes$target = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
};
var _elm_lang$html$Html_Attributes$downloadAs = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
};
var _elm_lang$html$Html_Attributes$hreflang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
};
var _elm_lang$html$Html_Attributes$ping = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
};
var _elm_lang$html$Html_Attributes$start = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'start',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$headers = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
};
var _elm_lang$html$Html_Attributes$scope = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
};
var _elm_lang$html$Html_Attributes$boolProperty = F2(
	function (name, bool) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$bool(bool));
	});
var _elm_lang$html$Html_Attributes$hidden = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
};
var _elm_lang$html$Html_Attributes$contenteditable = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
};
var _elm_lang$html$Html_Attributes$spellcheck = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
};
var _elm_lang$html$Html_Attributes$async = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
};
var _elm_lang$html$Html_Attributes$defer = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
};
var _elm_lang$html$Html_Attributes$scoped = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
};
var _elm_lang$html$Html_Attributes$autoplay = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
};
var _elm_lang$html$Html_Attributes$controls = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
};
var _elm_lang$html$Html_Attributes$loop = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
};
var _elm_lang$html$Html_Attributes$default = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
};
var _elm_lang$html$Html_Attributes$seamless = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
};
var _elm_lang$html$Html_Attributes$checked = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
};
var _elm_lang$html$Html_Attributes$selected = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
};
var _elm_lang$html$Html_Attributes$autofocus = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
};
var _elm_lang$html$Html_Attributes$disabled = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
};
var _elm_lang$html$Html_Attributes$multiple = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
};
var _elm_lang$html$Html_Attributes$novalidate = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
};
var _elm_lang$html$Html_Attributes$readonly = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
};
var _elm_lang$html$Html_Attributes$required = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
};
var _elm_lang$html$Html_Attributes$ismap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
};
var _elm_lang$html$Html_Attributes$download = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
};
var _elm_lang$html$Html_Attributes$reversed = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
};
var _elm_lang$html$Html_Attributes$classList = function (list) {
	return _elm_lang$html$Html_Attributes$class(
		A2(
			_elm_lang$core$String$join,
			' ',
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$filter, _elm_lang$core$Tuple$second, list))));
};
var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int);
var _elm_lang$html$Html_Events$targetChecked = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'checked',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$bool);
var _elm_lang$html$Html_Events$targetValue = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'value',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$string);
var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
var _elm_lang$html$Html_Events$onFocus = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'focus',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onBlur = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'blur',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(
	_elm_lang$html$Html_Events$defaultOptions,
	{preventDefault: true});
var _elm_lang$html$Html_Events$onSubmit = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'submit',
		_elm_lang$html$Html_Events$onSubmitOptions,
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onCheck = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
};
var _elm_lang$html$Html_Events$onInput = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'input',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
};
var _elm_lang$html$Html_Events$onMouseOut = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseout',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseOver = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseover',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseLeave = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseleave',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseEnter = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseenter',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseUp = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseup',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseDown = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mousedown',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onDoubleClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'dblclick',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'click',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});

var _elm_lang$html$Html_Keyed$node = _elm_lang$virtual_dom$VirtualDom$keyedNode;
var _elm_lang$html$Html_Keyed$ol = _elm_lang$html$Html_Keyed$node('ol');
var _elm_lang$html$Html_Keyed$ul = _elm_lang$html$Html_Keyed$node('ul');

var _elm_lang$html$Html_Lazy$lazy3 = _elm_lang$virtual_dom$VirtualDom$lazy3;
var _elm_lang$html$Html_Lazy$lazy2 = _elm_lang$virtual_dom$VirtualDom$lazy2;
var _elm_lang$html$Html_Lazy$lazy = _elm_lang$virtual_dom$VirtualDom$lazy;

var _elm_lang$http$Native_Http = function() {


// ENCODING AND DECODING

function encodeUri(string)
{
	return encodeURIComponent(string);
}

function decodeUri(string)
{
	try
	{
		return _elm_lang$core$Maybe$Just(decodeURIComponent(string));
	}
	catch(e)
	{
		return _elm_lang$core$Maybe$Nothing;
	}
}


// SEND REQUEST

function toTask(request, maybeProgress)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NetworkError' }));
		});
		xhr.addEventListener('timeout', function() {
			callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'Timeout' }));
		});
		xhr.addEventListener('load', function() {
			callback(handleResponse(xhr, request.expect.responseToResult));
		});

		try
		{
			xhr.open(request.method, request.url, true);
		}
		catch (e)
		{
			return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'BadUrl', _0: request.url }));
		}

		configureRequest(xhr, request);
		send(xhr, request.body);

		return function() { xhr.abort(); };
	});
}

function configureProgress(xhr, maybeProgress)
{
	if (maybeProgress.ctor === 'Nothing')
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_elm_lang$core$Native_Scheduler.rawSpawn(maybeProgress._0({
			bytes: event.loaded,
			bytesExpected: event.total
		}));
	});
}

function configureRequest(xhr, request)
{
	function setHeader(pair)
	{
		xhr.setRequestHeader(pair._0, pair._1);
	}

	A2(_elm_lang$core$List$map, setHeader, request.headers);
	xhr.responseType = request.expect.responseType;
	xhr.withCredentials = request.withCredentials;

	if (request.timeout.ctor === 'Just')
	{
		xhr.timeout = request.timeout._0;
	}
}

function send(xhr, body)
{
	switch (body.ctor)
	{
		case 'EmptyBody':
			xhr.send();
			return;

		case 'StringBody':
			xhr.setRequestHeader('Content-Type', body._0);
			xhr.send(body._1);
			return;

		case 'FormDataBody':
			xhr.send(body._0);
			return;
	}
}


// RESPONSES

function handleResponse(xhr, responseToResult)
{
	var response = toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _elm_lang$core$Native_Scheduler.fail({
			ctor: 'BadStatus',
			_0: response
		});
	}

	var result = responseToResult(response);

	if (result.ctor === 'Ok')
	{
		return _elm_lang$core$Native_Scheduler.succeed(result._0);
	}
	else
	{
		response.body = xhr.responseText;
		return _elm_lang$core$Native_Scheduler.fail({
			ctor: 'BadPayload',
			_0: result._0,
			_1: response
		});
	}
}

function toResponse(xhr)
{
	return {
		status: { code: xhr.status, message: xhr.statusText },
		headers: parseHeaders(xhr.getAllResponseHeaders()),
		url: xhr.responseURL,
		body: xhr.response
	};
}

function parseHeaders(rawHeaders)
{
	var headers = _elm_lang$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(_elm_lang$core$Dict$update, key, function(oldValue) {
				if (oldValue.ctor === 'Just')
				{
					return _elm_lang$core$Maybe$Just(value + ', ' + oldValue._0);
				}
				return _elm_lang$core$Maybe$Just(value);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function expectStringResponse(responseToResult)
{
	return {
		responseType: 'text',
		responseToResult: responseToResult
	};
}

function mapExpect(func, expect)
{
	return {
		responseType: expect.responseType,
		responseToResult: function(response) {
			var convertedResponse = expect.responseToResult(response);
			return A2(_elm_lang$core$Result$map, func, convertedResponse);
		}
	};
}


// BODY

function multipart(parts)
{
	var formData = new FormData();

	while (parts.ctor !== '[]')
	{
		var part = parts._0;
		formData.append(part._0, part._1);
		parts = parts._1;
	}

	return { ctor: 'FormDataBody', _0: formData };
}

return {
	toTask: F2(toTask),
	expectStringResponse: expectStringResponse,
	mapExpect: F2(mapExpect),
	multipart: multipart,
	encodeUri: encodeUri,
	decodeUri: decodeUri
};

}();

var _elm_lang$http$Http_Internal$map = F2(
	function (func, request) {
		return _elm_lang$core$Native_Utils.update(
			request,
			{
				expect: A2(_elm_lang$http$Native_Http.mapExpect, func, request.expect)
			});
	});
var _elm_lang$http$Http_Internal$RawRequest = F7(
	function (a, b, c, d, e, f, g) {
		return {method: a, headers: b, url: c, body: d, expect: e, timeout: f, withCredentials: g};
	});
var _elm_lang$http$Http_Internal$Request = function (a) {
	return {ctor: 'Request', _0: a};
};
var _elm_lang$http$Http_Internal$Expect = {ctor: 'Expect'};
var _elm_lang$http$Http_Internal$FormDataBody = {ctor: 'FormDataBody'};
var _elm_lang$http$Http_Internal$StringBody = F2(
	function (a, b) {
		return {ctor: 'StringBody', _0: a, _1: b};
	});
var _elm_lang$http$Http_Internal$EmptyBody = {ctor: 'EmptyBody'};
var _elm_lang$http$Http_Internal$Header = F2(
	function (a, b) {
		return {ctor: 'Header', _0: a, _1: b};
	});

var _elm_lang$http$Http$decodeUri = _elm_lang$http$Native_Http.decodeUri;
var _elm_lang$http$Http$encodeUri = _elm_lang$http$Native_Http.encodeUri;
var _elm_lang$http$Http$expectStringResponse = _elm_lang$http$Native_Http.expectStringResponse;
var _elm_lang$http$Http$expectJson = function (decoder) {
	return _elm_lang$http$Http$expectStringResponse(
		function (response) {
			return A2(_elm_lang$core$Json_Decode$decodeString, decoder, response.body);
		});
};
var _elm_lang$http$Http$expectString = _elm_lang$http$Http$expectStringResponse(
	function (response) {
		return _elm_lang$core$Result$Ok(response.body);
	});
var _elm_lang$http$Http$multipartBody = _elm_lang$http$Native_Http.multipart;
var _elm_lang$http$Http$stringBody = _elm_lang$http$Http_Internal$StringBody;
var _elm_lang$http$Http$jsonBody = function (value) {
	return A2(
		_elm_lang$http$Http_Internal$StringBody,
		'application/json',
		A2(_elm_lang$core$Json_Encode$encode, 0, value));
};
var _elm_lang$http$Http$emptyBody = _elm_lang$http$Http_Internal$EmptyBody;
var _elm_lang$http$Http$header = _elm_lang$http$Http_Internal$Header;
var _elm_lang$http$Http$request = _elm_lang$http$Http_Internal$Request;
var _elm_lang$http$Http$post = F3(
	function (url, body, decoder) {
		return _elm_lang$http$Http$request(
			{
				method: 'POST',
				headers: {ctor: '[]'},
				url: url,
				body: body,
				expect: _elm_lang$http$Http$expectJson(decoder),
				timeout: _elm_lang$core$Maybe$Nothing,
				withCredentials: false
			});
	});
var _elm_lang$http$Http$get = F2(
	function (url, decoder) {
		return _elm_lang$http$Http$request(
			{
				method: 'GET',
				headers: {ctor: '[]'},
				url: url,
				body: _elm_lang$http$Http$emptyBody,
				expect: _elm_lang$http$Http$expectJson(decoder),
				timeout: _elm_lang$core$Maybe$Nothing,
				withCredentials: false
			});
	});
var _elm_lang$http$Http$getString = function (url) {
	return _elm_lang$http$Http$request(
		{
			method: 'GET',
			headers: {ctor: '[]'},
			url: url,
			body: _elm_lang$http$Http$emptyBody,
			expect: _elm_lang$http$Http$expectString,
			timeout: _elm_lang$core$Maybe$Nothing,
			withCredentials: false
		});
};
var _elm_lang$http$Http$toTask = function (_p0) {
	var _p1 = _p0;
	return A2(_elm_lang$http$Native_Http.toTask, _p1._0, _elm_lang$core$Maybe$Nothing);
};
var _elm_lang$http$Http$send = F2(
	function (resultToMessage, request) {
		return A2(
			_elm_lang$core$Task$attempt,
			resultToMessage,
			_elm_lang$http$Http$toTask(request));
	});
var _elm_lang$http$Http$Response = F4(
	function (a, b, c, d) {
		return {url: a, status: b, headers: c, body: d};
	});
var _elm_lang$http$Http$BadPayload = F2(
	function (a, b) {
		return {ctor: 'BadPayload', _0: a, _1: b};
	});
var _elm_lang$http$Http$BadStatus = function (a) {
	return {ctor: 'BadStatus', _0: a};
};
var _elm_lang$http$Http$NetworkError = {ctor: 'NetworkError'};
var _elm_lang$http$Http$Timeout = {ctor: 'Timeout'};
var _elm_lang$http$Http$BadUrl = function (a) {
	return {ctor: 'BadUrl', _0: a};
};
var _elm_lang$http$Http$StringPart = F2(
	function (a, b) {
		return {ctor: 'StringPart', _0: a, _1: b};
	});
var _elm_lang$http$Http$stringPart = _elm_lang$http$Http$StringPart;

var _elm_lang$keyboard$Keyboard$onSelfMsg = F3(
	function (router, _p0, state) {
		var _p1 = _p0;
		var _p2 = A2(_elm_lang$core$Dict$get, _p1.category, state);
		if (_p2.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			var send = function (tagger) {
				return A2(
					_elm_lang$core$Platform$sendToApp,
					router,
					tagger(_p1.keyCode));
			};
			return A2(
				_elm_lang$core$Task$andThen,
				function (_p3) {
					return _elm_lang$core$Task$succeed(state);
				},
				_elm_lang$core$Task$sequence(
					A2(_elm_lang$core$List$map, send, _p2._0.taggers)));
		}
	});
var _elm_lang$keyboard$Keyboard_ops = _elm_lang$keyboard$Keyboard_ops || {};
_elm_lang$keyboard$Keyboard_ops['&>'] = F2(
	function (task1, task2) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p4) {
				return task2;
			},
			task1);
	});
var _elm_lang$keyboard$Keyboard$init = _elm_lang$core$Task$succeed(_elm_lang$core$Dict$empty);
var _elm_lang$keyboard$Keyboard$categorizeHelpHelp = F2(
	function (value, maybeValues) {
		var _p5 = maybeValues;
		if (_p5.ctor === 'Nothing') {
			return _elm_lang$core$Maybe$Just(
				{
					ctor: '::',
					_0: value,
					_1: {ctor: '[]'}
				});
		} else {
			return _elm_lang$core$Maybe$Just(
				{ctor: '::', _0: value, _1: _p5._0});
		}
	});
var _elm_lang$keyboard$Keyboard$categorizeHelp = F2(
	function (subs, subDict) {
		categorizeHelp:
		while (true) {
			var _p6 = subs;
			if (_p6.ctor === '[]') {
				return subDict;
			} else {
				var _v4 = _p6._1,
					_v5 = A3(
					_elm_lang$core$Dict$update,
					_p6._0._0,
					_elm_lang$keyboard$Keyboard$categorizeHelpHelp(_p6._0._1),
					subDict);
				subs = _v4;
				subDict = _v5;
				continue categorizeHelp;
			}
		}
	});
var _elm_lang$keyboard$Keyboard$categorize = function (subs) {
	return A2(_elm_lang$keyboard$Keyboard$categorizeHelp, subs, _elm_lang$core$Dict$empty);
};
var _elm_lang$keyboard$Keyboard$keyCode = A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int);
var _elm_lang$keyboard$Keyboard$subscription = _elm_lang$core$Native_Platform.leaf('Keyboard');
var _elm_lang$keyboard$Keyboard$Watcher = F2(
	function (a, b) {
		return {taggers: a, pid: b};
	});
var _elm_lang$keyboard$Keyboard$Msg = F2(
	function (a, b) {
		return {category: a, keyCode: b};
	});
var _elm_lang$keyboard$Keyboard$onEffects = F3(
	function (router, newSubs, oldState) {
		var rightStep = F3(
			function (category, taggers, task) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (state) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (pid) {
								return _elm_lang$core$Task$succeed(
									A3(
										_elm_lang$core$Dict$insert,
										category,
										A2(_elm_lang$keyboard$Keyboard$Watcher, taggers, pid),
										state));
							},
							_elm_lang$core$Process$spawn(
								A3(
									_elm_lang$dom$Dom_LowLevel$onDocument,
									category,
									_elm_lang$keyboard$Keyboard$keyCode,
									function (_p7) {
										return A2(
											_elm_lang$core$Platform$sendToSelf,
											router,
											A2(_elm_lang$keyboard$Keyboard$Msg, category, _p7));
									})));
					},
					task);
			});
		var bothStep = F4(
			function (category, _p8, taggers, task) {
				var _p9 = _p8;
				return A2(
					_elm_lang$core$Task$map,
					A2(
						_elm_lang$core$Dict$insert,
						category,
						A2(_elm_lang$keyboard$Keyboard$Watcher, taggers, _p9.pid)),
					task);
			});
		var leftStep = F3(
			function (category, _p10, task) {
				var _p11 = _p10;
				return A2(
					_elm_lang$keyboard$Keyboard_ops['&>'],
					_elm_lang$core$Process$kill(_p11.pid),
					task);
			});
		return A6(
			_elm_lang$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			oldState,
			_elm_lang$keyboard$Keyboard$categorize(newSubs),
			_elm_lang$core$Task$succeed(_elm_lang$core$Dict$empty));
	});
var _elm_lang$keyboard$Keyboard$MySub = F2(
	function (a, b) {
		return {ctor: 'MySub', _0: a, _1: b};
	});
var _elm_lang$keyboard$Keyboard$presses = function (tagger) {
	return _elm_lang$keyboard$Keyboard$subscription(
		A2(_elm_lang$keyboard$Keyboard$MySub, 'keypress', tagger));
};
var _elm_lang$keyboard$Keyboard$downs = function (tagger) {
	return _elm_lang$keyboard$Keyboard$subscription(
		A2(_elm_lang$keyboard$Keyboard$MySub, 'keydown', tagger));
};
var _elm_lang$keyboard$Keyboard$ups = function (tagger) {
	return _elm_lang$keyboard$Keyboard$subscription(
		A2(_elm_lang$keyboard$Keyboard$MySub, 'keyup', tagger));
};
var _elm_lang$keyboard$Keyboard$subMap = F2(
	function (func, _p12) {
		var _p13 = _p12;
		return A2(
			_elm_lang$keyboard$Keyboard$MySub,
			_p13._0,
			function (_p14) {
				return func(
					_p13._1(_p14));
			});
	});
_elm_lang$core$Native_Platform.effectManagers['Keyboard'] = {pkg: 'elm-lang/keyboard', init: _elm_lang$keyboard$Keyboard$init, onEffects: _elm_lang$keyboard$Keyboard$onEffects, onSelfMsg: _elm_lang$keyboard$Keyboard$onSelfMsg, tag: 'sub', subMap: _elm_lang$keyboard$Keyboard$subMap};

var _elm_lang$lazy$Native_Lazy = function() {

function memoize(thunk)
{
    var value;
    var isForced = false;
    return function(tuple0) {
        if (!isForced) {
            value = thunk(tuple0);
            isForced = true;
        }
        return value;
    };
}

return {
    memoize: memoize
};

}();

var _elm_lang$lazy$Lazy$force = function (_p0) {
	var _p1 = _p0;
	return _p1._0(
		{ctor: '_Tuple0'});
};
var _elm_lang$lazy$Lazy$Lazy = function (a) {
	return {ctor: 'Lazy', _0: a};
};
var _elm_lang$lazy$Lazy$lazy = function (thunk) {
	return _elm_lang$lazy$Lazy$Lazy(
		_elm_lang$lazy$Native_Lazy.memoize(thunk));
};
var _elm_lang$lazy$Lazy$map = F2(
	function (f, a) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p2) {
				var _p3 = _p2;
				return f(
					_elm_lang$lazy$Lazy$force(a));
			});
	});
var _elm_lang$lazy$Lazy$map2 = F3(
	function (f, a, b) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p4) {
				var _p5 = _p4;
				return A2(
					f,
					_elm_lang$lazy$Lazy$force(a),
					_elm_lang$lazy$Lazy$force(b));
			});
	});
var _elm_lang$lazy$Lazy$map3 = F4(
	function (f, a, b, c) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p6) {
				var _p7 = _p6;
				return A3(
					f,
					_elm_lang$lazy$Lazy$force(a),
					_elm_lang$lazy$Lazy$force(b),
					_elm_lang$lazy$Lazy$force(c));
			});
	});
var _elm_lang$lazy$Lazy$map4 = F5(
	function (f, a, b, c, d) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p8) {
				var _p9 = _p8;
				return A4(
					f,
					_elm_lang$lazy$Lazy$force(a),
					_elm_lang$lazy$Lazy$force(b),
					_elm_lang$lazy$Lazy$force(c),
					_elm_lang$lazy$Lazy$force(d));
			});
	});
var _elm_lang$lazy$Lazy$map5 = F6(
	function (f, a, b, c, d, e) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p10) {
				var _p11 = _p10;
				return A5(
					f,
					_elm_lang$lazy$Lazy$force(a),
					_elm_lang$lazy$Lazy$force(b),
					_elm_lang$lazy$Lazy$force(c),
					_elm_lang$lazy$Lazy$force(d),
					_elm_lang$lazy$Lazy$force(e));
			});
	});
var _elm_lang$lazy$Lazy$apply = F2(
	function (f, x) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p12) {
				var _p13 = _p12;
				return A2(
					_elm_lang$lazy$Lazy$force,
					f,
					_elm_lang$lazy$Lazy$force(x));
			});
	});
var _elm_lang$lazy$Lazy$andThen = F2(
	function (callback, a) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p14) {
				var _p15 = _p14;
				return _elm_lang$lazy$Lazy$force(
					callback(
						_elm_lang$lazy$Lazy$force(a)));
			});
	});

var _elm_lang$mouse$Mouse_ops = _elm_lang$mouse$Mouse_ops || {};
_elm_lang$mouse$Mouse_ops['&>'] = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p0) {
				return t2;
			},
			t1);
	});
var _elm_lang$mouse$Mouse$onSelfMsg = F3(
	function (router, _p1, state) {
		var _p2 = _p1;
		var _p3 = A2(_elm_lang$core$Dict$get, _p2.category, state);
		if (_p3.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			var send = function (tagger) {
				return A2(
					_elm_lang$core$Platform$sendToApp,
					router,
					tagger(_p2.position));
			};
			return A2(
				_elm_lang$mouse$Mouse_ops['&>'],
				_elm_lang$core$Task$sequence(
					A2(_elm_lang$core$List$map, send, _p3._0.taggers)),
				_elm_lang$core$Task$succeed(state));
		}
	});
var _elm_lang$mouse$Mouse$init = _elm_lang$core$Task$succeed(_elm_lang$core$Dict$empty);
var _elm_lang$mouse$Mouse$categorizeHelpHelp = F2(
	function (value, maybeValues) {
		var _p4 = maybeValues;
		if (_p4.ctor === 'Nothing') {
			return _elm_lang$core$Maybe$Just(
				{
					ctor: '::',
					_0: value,
					_1: {ctor: '[]'}
				});
		} else {
			return _elm_lang$core$Maybe$Just(
				{ctor: '::', _0: value, _1: _p4._0});
		}
	});
var _elm_lang$mouse$Mouse$categorizeHelp = F2(
	function (subs, subDict) {
		categorizeHelp:
		while (true) {
			var _p5 = subs;
			if (_p5.ctor === '[]') {
				return subDict;
			} else {
				var _v4 = _p5._1,
					_v5 = A3(
					_elm_lang$core$Dict$update,
					_p5._0._0,
					_elm_lang$mouse$Mouse$categorizeHelpHelp(_p5._0._1),
					subDict);
				subs = _v4;
				subDict = _v5;
				continue categorizeHelp;
			}
		}
	});
var _elm_lang$mouse$Mouse$categorize = function (subs) {
	return A2(_elm_lang$mouse$Mouse$categorizeHelp, subs, _elm_lang$core$Dict$empty);
};
var _elm_lang$mouse$Mouse$subscription = _elm_lang$core$Native_Platform.leaf('Mouse');
var _elm_lang$mouse$Mouse$Position = F2(
	function (a, b) {
		return {x: a, y: b};
	});
var _elm_lang$mouse$Mouse$position = A3(
	_elm_lang$core$Json_Decode$map2,
	_elm_lang$mouse$Mouse$Position,
	A2(_elm_lang$core$Json_Decode$field, 'pageX', _elm_lang$core$Json_Decode$int),
	A2(_elm_lang$core$Json_Decode$field, 'pageY', _elm_lang$core$Json_Decode$int));
var _elm_lang$mouse$Mouse$Watcher = F2(
	function (a, b) {
		return {taggers: a, pid: b};
	});
var _elm_lang$mouse$Mouse$Msg = F2(
	function (a, b) {
		return {category: a, position: b};
	});
var _elm_lang$mouse$Mouse$onEffects = F3(
	function (router, newSubs, oldState) {
		var rightStep = F3(
			function (category, taggers, task) {
				var tracker = A3(
					_elm_lang$dom$Dom_LowLevel$onDocument,
					category,
					_elm_lang$mouse$Mouse$position,
					function (_p6) {
						return A2(
							_elm_lang$core$Platform$sendToSelf,
							router,
							A2(_elm_lang$mouse$Mouse$Msg, category, _p6));
					});
				return A2(
					_elm_lang$core$Task$andThen,
					function (state) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (pid) {
								return _elm_lang$core$Task$succeed(
									A3(
										_elm_lang$core$Dict$insert,
										category,
										A2(_elm_lang$mouse$Mouse$Watcher, taggers, pid),
										state));
							},
							_elm_lang$core$Process$spawn(tracker));
					},
					task);
			});
		var bothStep = F4(
			function (category, _p7, taggers, task) {
				var _p8 = _p7;
				return A2(
					_elm_lang$core$Task$andThen,
					function (state) {
						return _elm_lang$core$Task$succeed(
							A3(
								_elm_lang$core$Dict$insert,
								category,
								A2(_elm_lang$mouse$Mouse$Watcher, taggers, _p8.pid),
								state));
					},
					task);
			});
		var leftStep = F3(
			function (category, _p9, task) {
				var _p10 = _p9;
				return A2(
					_elm_lang$mouse$Mouse_ops['&>'],
					_elm_lang$core$Process$kill(_p10.pid),
					task);
			});
		return A6(
			_elm_lang$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			oldState,
			_elm_lang$mouse$Mouse$categorize(newSubs),
			_elm_lang$core$Task$succeed(_elm_lang$core$Dict$empty));
	});
var _elm_lang$mouse$Mouse$MySub = F2(
	function (a, b) {
		return {ctor: 'MySub', _0: a, _1: b};
	});
var _elm_lang$mouse$Mouse$clicks = function (tagger) {
	return _elm_lang$mouse$Mouse$subscription(
		A2(_elm_lang$mouse$Mouse$MySub, 'click', tagger));
};
var _elm_lang$mouse$Mouse$moves = function (tagger) {
	return _elm_lang$mouse$Mouse$subscription(
		A2(_elm_lang$mouse$Mouse$MySub, 'mousemove', tagger));
};
var _elm_lang$mouse$Mouse$downs = function (tagger) {
	return _elm_lang$mouse$Mouse$subscription(
		A2(_elm_lang$mouse$Mouse$MySub, 'mousedown', tagger));
};
var _elm_lang$mouse$Mouse$ups = function (tagger) {
	return _elm_lang$mouse$Mouse$subscription(
		A2(_elm_lang$mouse$Mouse$MySub, 'mouseup', tagger));
};
var _elm_lang$mouse$Mouse$subMap = F2(
	function (func, _p11) {
		var _p12 = _p11;
		return A2(
			_elm_lang$mouse$Mouse$MySub,
			_p12._0,
			function (_p13) {
				return func(
					_p12._1(_p13));
			});
	});
_elm_lang$core$Native_Platform.effectManagers['Mouse'] = {pkg: 'elm-lang/mouse', init: _elm_lang$mouse$Mouse$init, onEffects: _elm_lang$mouse$Mouse$onEffects, onSelfMsg: _elm_lang$mouse$Mouse$onSelfMsg, tag: 'sub', subMap: _elm_lang$mouse$Mouse$subMap};

var _elm_lang$navigation$Native_Navigation = function() {


// FAKE NAVIGATION

function go(n)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		if (n !== 0)
		{
			history.go(n);
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function pushState(url)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		history.pushState({}, '', url);
		callback(_elm_lang$core$Native_Scheduler.succeed(getLocation()));
	});
}

function replaceState(url)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		history.replaceState({}, '', url);
		callback(_elm_lang$core$Native_Scheduler.succeed(getLocation()));
	});
}


// REAL NAVIGATION

function reloadPage(skipCache)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		document.location.reload(skipCache);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function setLocation(url)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		try
		{
			window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			document.location.reload(false);
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}


// GET LOCATION

function getLocation()
{
	var location = document.location;

	return {
		href: location.href,
		host: location.host,
		hostname: location.hostname,
		protocol: location.protocol,
		origin: location.origin,
		port_: location.port,
		pathname: location.pathname,
		search: location.search,
		hash: location.hash,
		username: location.username,
		password: location.password
	};
}


// DETECT IE11 PROBLEMS

function isInternetExplorer11()
{
	return window.navigator.userAgent.indexOf('Trident') !== -1;
}


return {
	go: go,
	setLocation: setLocation,
	reloadPage: reloadPage,
	pushState: pushState,
	replaceState: replaceState,
	getLocation: getLocation,
	isInternetExplorer11: isInternetExplorer11
};

}();

var _elm_lang$navigation$Navigation$replaceState = _elm_lang$navigation$Native_Navigation.replaceState;
var _elm_lang$navigation$Navigation$pushState = _elm_lang$navigation$Native_Navigation.pushState;
var _elm_lang$navigation$Navigation$go = _elm_lang$navigation$Native_Navigation.go;
var _elm_lang$navigation$Navigation$reloadPage = _elm_lang$navigation$Native_Navigation.reloadPage;
var _elm_lang$navigation$Navigation$setLocation = _elm_lang$navigation$Native_Navigation.setLocation;
var _elm_lang$navigation$Navigation_ops = _elm_lang$navigation$Navigation_ops || {};
_elm_lang$navigation$Navigation_ops['&>'] = F2(
	function (task1, task2) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p0) {
				return task2;
			},
			task1);
	});
var _elm_lang$navigation$Navigation$notify = F3(
	function (router, subs, location) {
		var send = function (_p1) {
			var _p2 = _p1;
			return A2(
				_elm_lang$core$Platform$sendToApp,
				router,
				_p2._0(location));
		};
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			_elm_lang$core$Task$sequence(
				A2(_elm_lang$core$List$map, send, subs)),
			_elm_lang$core$Task$succeed(
				{ctor: '_Tuple0'}));
	});
var _elm_lang$navigation$Navigation$cmdHelp = F3(
	function (router, subs, cmd) {
		var _p3 = cmd;
		switch (_p3.ctor) {
			case 'Jump':
				return _elm_lang$navigation$Navigation$go(_p3._0);
			case 'New':
				return A2(
					_elm_lang$core$Task$andThen,
					A2(_elm_lang$navigation$Navigation$notify, router, subs),
					_elm_lang$navigation$Navigation$pushState(_p3._0));
			case 'Modify':
				return A2(
					_elm_lang$core$Task$andThen,
					A2(_elm_lang$navigation$Navigation$notify, router, subs),
					_elm_lang$navigation$Navigation$replaceState(_p3._0));
			case 'Visit':
				return _elm_lang$navigation$Navigation$setLocation(_p3._0);
			default:
				return _elm_lang$navigation$Navigation$reloadPage(_p3._0);
		}
	});
var _elm_lang$navigation$Navigation$killPopWatcher = function (popWatcher) {
	var _p4 = popWatcher;
	if (_p4.ctor === 'Normal') {
		return _elm_lang$core$Process$kill(_p4._0);
	} else {
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			_elm_lang$core$Process$kill(_p4._0),
			_elm_lang$core$Process$kill(_p4._1));
	}
};
var _elm_lang$navigation$Navigation$onSelfMsg = F3(
	function (router, location, state) {
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			A3(_elm_lang$navigation$Navigation$notify, router, state.subs, location),
			_elm_lang$core$Task$succeed(state));
	});
var _elm_lang$navigation$Navigation$subscription = _elm_lang$core$Native_Platform.leaf('Navigation');
var _elm_lang$navigation$Navigation$command = _elm_lang$core$Native_Platform.leaf('Navigation');
var _elm_lang$navigation$Navigation$Location = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return {href: a, host: b, hostname: c, protocol: d, origin: e, port_: f, pathname: g, search: h, hash: i, username: j, password: k};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$navigation$Navigation$State = F2(
	function (a, b) {
		return {subs: a, popWatcher: b};
	});
var _elm_lang$navigation$Navigation$init = _elm_lang$core$Task$succeed(
	A2(
		_elm_lang$navigation$Navigation$State,
		{ctor: '[]'},
		_elm_lang$core$Maybe$Nothing));
var _elm_lang$navigation$Navigation$Reload = function (a) {
	return {ctor: 'Reload', _0: a};
};
var _elm_lang$navigation$Navigation$reload = _elm_lang$navigation$Navigation$command(
	_elm_lang$navigation$Navigation$Reload(false));
var _elm_lang$navigation$Navigation$reloadAndSkipCache = _elm_lang$navigation$Navigation$command(
	_elm_lang$navigation$Navigation$Reload(true));
var _elm_lang$navigation$Navigation$Visit = function (a) {
	return {ctor: 'Visit', _0: a};
};
var _elm_lang$navigation$Navigation$load = function (url) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Visit(url));
};
var _elm_lang$navigation$Navigation$Modify = function (a) {
	return {ctor: 'Modify', _0: a};
};
var _elm_lang$navigation$Navigation$modifyUrl = function (url) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Modify(url));
};
var _elm_lang$navigation$Navigation$New = function (a) {
	return {ctor: 'New', _0: a};
};
var _elm_lang$navigation$Navigation$newUrl = function (url) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$New(url));
};
var _elm_lang$navigation$Navigation$Jump = function (a) {
	return {ctor: 'Jump', _0: a};
};
var _elm_lang$navigation$Navigation$back = function (n) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Jump(0 - n));
};
var _elm_lang$navigation$Navigation$forward = function (n) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Jump(n));
};
var _elm_lang$navigation$Navigation$cmdMap = F2(
	function (_p5, myCmd) {
		var _p6 = myCmd;
		switch (_p6.ctor) {
			case 'Jump':
				return _elm_lang$navigation$Navigation$Jump(_p6._0);
			case 'New':
				return _elm_lang$navigation$Navigation$New(_p6._0);
			case 'Modify':
				return _elm_lang$navigation$Navigation$Modify(_p6._0);
			case 'Visit':
				return _elm_lang$navigation$Navigation$Visit(_p6._0);
			default:
				return _elm_lang$navigation$Navigation$Reload(_p6._0);
		}
	});
var _elm_lang$navigation$Navigation$Monitor = function (a) {
	return {ctor: 'Monitor', _0: a};
};
var _elm_lang$navigation$Navigation$program = F2(
	function (locationToMessage, stuff) {
		var init = stuff.init(
			_elm_lang$navigation$Native_Navigation.getLocation(
				{ctor: '_Tuple0'}));
		var subs = function (model) {
			return _elm_lang$core$Platform_Sub$batch(
				{
					ctor: '::',
					_0: _elm_lang$navigation$Navigation$subscription(
						_elm_lang$navigation$Navigation$Monitor(locationToMessage)),
					_1: {
						ctor: '::',
						_0: stuff.subscriptions(model),
						_1: {ctor: '[]'}
					}
				});
		};
		return _elm_lang$html$Html$program(
			{init: init, view: stuff.view, update: stuff.update, subscriptions: subs});
	});
var _elm_lang$navigation$Navigation$programWithFlags = F2(
	function (locationToMessage, stuff) {
		var init = function (flags) {
			return A2(
				stuff.init,
				flags,
				_elm_lang$navigation$Native_Navigation.getLocation(
					{ctor: '_Tuple0'}));
		};
		var subs = function (model) {
			return _elm_lang$core$Platform_Sub$batch(
				{
					ctor: '::',
					_0: _elm_lang$navigation$Navigation$subscription(
						_elm_lang$navigation$Navigation$Monitor(locationToMessage)),
					_1: {
						ctor: '::',
						_0: stuff.subscriptions(model),
						_1: {ctor: '[]'}
					}
				});
		};
		return _elm_lang$html$Html$programWithFlags(
			{init: init, view: stuff.view, update: stuff.update, subscriptions: subs});
	});
var _elm_lang$navigation$Navigation$subMap = F2(
	function (func, _p7) {
		var _p8 = _p7;
		return _elm_lang$navigation$Navigation$Monitor(
			function (_p9) {
				return func(
					_p8._0(_p9));
			});
	});
var _elm_lang$navigation$Navigation$InternetExplorer = F2(
	function (a, b) {
		return {ctor: 'InternetExplorer', _0: a, _1: b};
	});
var _elm_lang$navigation$Navigation$Normal = function (a) {
	return {ctor: 'Normal', _0: a};
};
var _elm_lang$navigation$Navigation$spawnPopWatcher = function (router) {
	var reportLocation = function (_p10) {
		return A2(
			_elm_lang$core$Platform$sendToSelf,
			router,
			_elm_lang$navigation$Native_Navigation.getLocation(
				{ctor: '_Tuple0'}));
	};
	return _elm_lang$navigation$Native_Navigation.isInternetExplorer11(
		{ctor: '_Tuple0'}) ? A3(
		_elm_lang$core$Task$map2,
		_elm_lang$navigation$Navigation$InternetExplorer,
		_elm_lang$core$Process$spawn(
			A3(_elm_lang$dom$Dom_LowLevel$onWindow, 'popstate', _elm_lang$core$Json_Decode$value, reportLocation)),
		_elm_lang$core$Process$spawn(
			A3(_elm_lang$dom$Dom_LowLevel$onWindow, 'hashchange', _elm_lang$core$Json_Decode$value, reportLocation))) : A2(
		_elm_lang$core$Task$map,
		_elm_lang$navigation$Navigation$Normal,
		_elm_lang$core$Process$spawn(
			A3(_elm_lang$dom$Dom_LowLevel$onWindow, 'popstate', _elm_lang$core$Json_Decode$value, reportLocation)));
};
var _elm_lang$navigation$Navigation$onEffects = F4(
	function (router, cmds, subs, _p11) {
		var _p12 = _p11;
		var _p15 = _p12.popWatcher;
		var stepState = function () {
			var _p13 = {ctor: '_Tuple2', _0: subs, _1: _p15};
			_v6_2:
			do {
				if (_p13._0.ctor === '[]') {
					if (_p13._1.ctor === 'Just') {
						return A2(
							_elm_lang$navigation$Navigation_ops['&>'],
							_elm_lang$navigation$Navigation$killPopWatcher(_p13._1._0),
							_elm_lang$core$Task$succeed(
								A2(_elm_lang$navigation$Navigation$State, subs, _elm_lang$core$Maybe$Nothing)));
					} else {
						break _v6_2;
					}
				} else {
					if (_p13._1.ctor === 'Nothing') {
						return A2(
							_elm_lang$core$Task$map,
							function (_p14) {
								return A2(
									_elm_lang$navigation$Navigation$State,
									subs,
									_elm_lang$core$Maybe$Just(_p14));
							},
							_elm_lang$navigation$Navigation$spawnPopWatcher(router));
					} else {
						break _v6_2;
					}
				}
			} while(false);
			return _elm_lang$core$Task$succeed(
				A2(_elm_lang$navigation$Navigation$State, subs, _p15));
		}();
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			_elm_lang$core$Task$sequence(
				A2(
					_elm_lang$core$List$map,
					A2(_elm_lang$navigation$Navigation$cmdHelp, router, subs),
					cmds)),
			stepState);
	});
_elm_lang$core$Native_Platform.effectManagers['Navigation'] = {pkg: 'elm-lang/navigation', init: _elm_lang$navigation$Navigation$init, onEffects: _elm_lang$navigation$Navigation$onEffects, onSelfMsg: _elm_lang$navigation$Navigation$onSelfMsg, tag: 'fx', cmdMap: _elm_lang$navigation$Navigation$cmdMap, subMap: _elm_lang$navigation$Navigation$subMap};

var _elm_lang$svg$Svg$map = _elm_lang$virtual_dom$VirtualDom$map;
var _elm_lang$svg$Svg$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$svg$Svg$svgNamespace = A2(
	_elm_lang$virtual_dom$VirtualDom$property,
	'namespace',
	_elm_lang$core$Json_Encode$string('http://www.w3.org/2000/svg'));
var _elm_lang$svg$Svg$node = F3(
	function (name, attributes, children) {
		return A3(
			_elm_lang$virtual_dom$VirtualDom$node,
			name,
			{ctor: '::', _0: _elm_lang$svg$Svg$svgNamespace, _1: attributes},
			children);
	});
var _elm_lang$svg$Svg$svg = _elm_lang$svg$Svg$node('svg');
var _elm_lang$svg$Svg$foreignObject = _elm_lang$svg$Svg$node('foreignObject');
var _elm_lang$svg$Svg$animate = _elm_lang$svg$Svg$node('animate');
var _elm_lang$svg$Svg$animateColor = _elm_lang$svg$Svg$node('animateColor');
var _elm_lang$svg$Svg$animateMotion = _elm_lang$svg$Svg$node('animateMotion');
var _elm_lang$svg$Svg$animateTransform = _elm_lang$svg$Svg$node('animateTransform');
var _elm_lang$svg$Svg$mpath = _elm_lang$svg$Svg$node('mpath');
var _elm_lang$svg$Svg$set = _elm_lang$svg$Svg$node('set');
var _elm_lang$svg$Svg$a = _elm_lang$svg$Svg$node('a');
var _elm_lang$svg$Svg$defs = _elm_lang$svg$Svg$node('defs');
var _elm_lang$svg$Svg$g = _elm_lang$svg$Svg$node('g');
var _elm_lang$svg$Svg$marker = _elm_lang$svg$Svg$node('marker');
var _elm_lang$svg$Svg$mask = _elm_lang$svg$Svg$node('mask');
var _elm_lang$svg$Svg$pattern = _elm_lang$svg$Svg$node('pattern');
var _elm_lang$svg$Svg$switch = _elm_lang$svg$Svg$node('switch');
var _elm_lang$svg$Svg$symbol = _elm_lang$svg$Svg$node('symbol');
var _elm_lang$svg$Svg$desc = _elm_lang$svg$Svg$node('desc');
var _elm_lang$svg$Svg$metadata = _elm_lang$svg$Svg$node('metadata');
var _elm_lang$svg$Svg$title = _elm_lang$svg$Svg$node('title');
var _elm_lang$svg$Svg$feBlend = _elm_lang$svg$Svg$node('feBlend');
var _elm_lang$svg$Svg$feColorMatrix = _elm_lang$svg$Svg$node('feColorMatrix');
var _elm_lang$svg$Svg$feComponentTransfer = _elm_lang$svg$Svg$node('feComponentTransfer');
var _elm_lang$svg$Svg$feComposite = _elm_lang$svg$Svg$node('feComposite');
var _elm_lang$svg$Svg$feConvolveMatrix = _elm_lang$svg$Svg$node('feConvolveMatrix');
var _elm_lang$svg$Svg$feDiffuseLighting = _elm_lang$svg$Svg$node('feDiffuseLighting');
var _elm_lang$svg$Svg$feDisplacementMap = _elm_lang$svg$Svg$node('feDisplacementMap');
var _elm_lang$svg$Svg$feFlood = _elm_lang$svg$Svg$node('feFlood');
var _elm_lang$svg$Svg$feFuncA = _elm_lang$svg$Svg$node('feFuncA');
var _elm_lang$svg$Svg$feFuncB = _elm_lang$svg$Svg$node('feFuncB');
var _elm_lang$svg$Svg$feFuncG = _elm_lang$svg$Svg$node('feFuncG');
var _elm_lang$svg$Svg$feFuncR = _elm_lang$svg$Svg$node('feFuncR');
var _elm_lang$svg$Svg$feGaussianBlur = _elm_lang$svg$Svg$node('feGaussianBlur');
var _elm_lang$svg$Svg$feImage = _elm_lang$svg$Svg$node('feImage');
var _elm_lang$svg$Svg$feMerge = _elm_lang$svg$Svg$node('feMerge');
var _elm_lang$svg$Svg$feMergeNode = _elm_lang$svg$Svg$node('feMergeNode');
var _elm_lang$svg$Svg$feMorphology = _elm_lang$svg$Svg$node('feMorphology');
var _elm_lang$svg$Svg$feOffset = _elm_lang$svg$Svg$node('feOffset');
var _elm_lang$svg$Svg$feSpecularLighting = _elm_lang$svg$Svg$node('feSpecularLighting');
var _elm_lang$svg$Svg$feTile = _elm_lang$svg$Svg$node('feTile');
var _elm_lang$svg$Svg$feTurbulence = _elm_lang$svg$Svg$node('feTurbulence');
var _elm_lang$svg$Svg$font = _elm_lang$svg$Svg$node('font');
var _elm_lang$svg$Svg$linearGradient = _elm_lang$svg$Svg$node('linearGradient');
var _elm_lang$svg$Svg$radialGradient = _elm_lang$svg$Svg$node('radialGradient');
var _elm_lang$svg$Svg$stop = _elm_lang$svg$Svg$node('stop');
var _elm_lang$svg$Svg$circle = _elm_lang$svg$Svg$node('circle');
var _elm_lang$svg$Svg$ellipse = _elm_lang$svg$Svg$node('ellipse');
var _elm_lang$svg$Svg$image = _elm_lang$svg$Svg$node('image');
var _elm_lang$svg$Svg$line = _elm_lang$svg$Svg$node('line');
var _elm_lang$svg$Svg$path = _elm_lang$svg$Svg$node('path');
var _elm_lang$svg$Svg$polygon = _elm_lang$svg$Svg$node('polygon');
var _elm_lang$svg$Svg$polyline = _elm_lang$svg$Svg$node('polyline');
var _elm_lang$svg$Svg$rect = _elm_lang$svg$Svg$node('rect');
var _elm_lang$svg$Svg$use = _elm_lang$svg$Svg$node('use');
var _elm_lang$svg$Svg$feDistantLight = _elm_lang$svg$Svg$node('feDistantLight');
var _elm_lang$svg$Svg$fePointLight = _elm_lang$svg$Svg$node('fePointLight');
var _elm_lang$svg$Svg$feSpotLight = _elm_lang$svg$Svg$node('feSpotLight');
var _elm_lang$svg$Svg$altGlyph = _elm_lang$svg$Svg$node('altGlyph');
var _elm_lang$svg$Svg$altGlyphDef = _elm_lang$svg$Svg$node('altGlyphDef');
var _elm_lang$svg$Svg$altGlyphItem = _elm_lang$svg$Svg$node('altGlyphItem');
var _elm_lang$svg$Svg$glyph = _elm_lang$svg$Svg$node('glyph');
var _elm_lang$svg$Svg$glyphRef = _elm_lang$svg$Svg$node('glyphRef');
var _elm_lang$svg$Svg$textPath = _elm_lang$svg$Svg$node('textPath');
var _elm_lang$svg$Svg$text_ = _elm_lang$svg$Svg$node('text');
var _elm_lang$svg$Svg$tref = _elm_lang$svg$Svg$node('tref');
var _elm_lang$svg$Svg$tspan = _elm_lang$svg$Svg$node('tspan');
var _elm_lang$svg$Svg$clipPath = _elm_lang$svg$Svg$node('clipPath');
var _elm_lang$svg$Svg$colorProfile = _elm_lang$svg$Svg$node('colorProfile');
var _elm_lang$svg$Svg$cursor = _elm_lang$svg$Svg$node('cursor');
var _elm_lang$svg$Svg$filter = _elm_lang$svg$Svg$node('filter');
var _elm_lang$svg$Svg$script = _elm_lang$svg$Svg$node('script');
var _elm_lang$svg$Svg$style = _elm_lang$svg$Svg$node('style');
var _elm_lang$svg$Svg$view = _elm_lang$svg$Svg$node('view');

var _elm_lang$svg$Svg_Attributes$writingMode = _elm_lang$virtual_dom$VirtualDom$attribute('writing-mode');
var _elm_lang$svg$Svg_Attributes$wordSpacing = _elm_lang$virtual_dom$VirtualDom$attribute('word-spacing');
var _elm_lang$svg$Svg_Attributes$visibility = _elm_lang$virtual_dom$VirtualDom$attribute('visibility');
var _elm_lang$svg$Svg_Attributes$unicodeBidi = _elm_lang$virtual_dom$VirtualDom$attribute('unicode-bidi');
var _elm_lang$svg$Svg_Attributes$textRendering = _elm_lang$virtual_dom$VirtualDom$attribute('text-rendering');
var _elm_lang$svg$Svg_Attributes$textDecoration = _elm_lang$virtual_dom$VirtualDom$attribute('text-decoration');
var _elm_lang$svg$Svg_Attributes$textAnchor = _elm_lang$virtual_dom$VirtualDom$attribute('text-anchor');
var _elm_lang$svg$Svg_Attributes$stroke = _elm_lang$virtual_dom$VirtualDom$attribute('stroke');
var _elm_lang$svg$Svg_Attributes$strokeWidth = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-width');
var _elm_lang$svg$Svg_Attributes$strokeOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-opacity');
var _elm_lang$svg$Svg_Attributes$strokeMiterlimit = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-miterlimit');
var _elm_lang$svg$Svg_Attributes$strokeLinejoin = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-linejoin');
var _elm_lang$svg$Svg_Attributes$strokeLinecap = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-linecap');
var _elm_lang$svg$Svg_Attributes$strokeDashoffset = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-dashoffset');
var _elm_lang$svg$Svg_Attributes$strokeDasharray = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-dasharray');
var _elm_lang$svg$Svg_Attributes$stopOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('stop-opacity');
var _elm_lang$svg$Svg_Attributes$stopColor = _elm_lang$virtual_dom$VirtualDom$attribute('stop-color');
var _elm_lang$svg$Svg_Attributes$shapeRendering = _elm_lang$virtual_dom$VirtualDom$attribute('shape-rendering');
var _elm_lang$svg$Svg_Attributes$pointerEvents = _elm_lang$virtual_dom$VirtualDom$attribute('pointer-events');
var _elm_lang$svg$Svg_Attributes$overflow = _elm_lang$virtual_dom$VirtualDom$attribute('overflow');
var _elm_lang$svg$Svg_Attributes$opacity = _elm_lang$virtual_dom$VirtualDom$attribute('opacity');
var _elm_lang$svg$Svg_Attributes$mask = _elm_lang$virtual_dom$VirtualDom$attribute('mask');
var _elm_lang$svg$Svg_Attributes$markerStart = _elm_lang$virtual_dom$VirtualDom$attribute('marker-start');
var _elm_lang$svg$Svg_Attributes$markerMid = _elm_lang$virtual_dom$VirtualDom$attribute('marker-mid');
var _elm_lang$svg$Svg_Attributes$markerEnd = _elm_lang$virtual_dom$VirtualDom$attribute('marker-end');
var _elm_lang$svg$Svg_Attributes$lightingColor = _elm_lang$virtual_dom$VirtualDom$attribute('lighting-color');
var _elm_lang$svg$Svg_Attributes$letterSpacing = _elm_lang$virtual_dom$VirtualDom$attribute('letter-spacing');
var _elm_lang$svg$Svg_Attributes$kerning = _elm_lang$virtual_dom$VirtualDom$attribute('kerning');
var _elm_lang$svg$Svg_Attributes$imageRendering = _elm_lang$virtual_dom$VirtualDom$attribute('image-rendering');
var _elm_lang$svg$Svg_Attributes$glyphOrientationVertical = _elm_lang$virtual_dom$VirtualDom$attribute('glyph-orientation-vertical');
var _elm_lang$svg$Svg_Attributes$glyphOrientationHorizontal = _elm_lang$virtual_dom$VirtualDom$attribute('glyph-orientation-horizontal');
var _elm_lang$svg$Svg_Attributes$fontWeight = _elm_lang$virtual_dom$VirtualDom$attribute('font-weight');
var _elm_lang$svg$Svg_Attributes$fontVariant = _elm_lang$virtual_dom$VirtualDom$attribute('font-variant');
var _elm_lang$svg$Svg_Attributes$fontStyle = _elm_lang$virtual_dom$VirtualDom$attribute('font-style');
var _elm_lang$svg$Svg_Attributes$fontStretch = _elm_lang$virtual_dom$VirtualDom$attribute('font-stretch');
var _elm_lang$svg$Svg_Attributes$fontSize = _elm_lang$virtual_dom$VirtualDom$attribute('font-size');
var _elm_lang$svg$Svg_Attributes$fontSizeAdjust = _elm_lang$virtual_dom$VirtualDom$attribute('font-size-adjust');
var _elm_lang$svg$Svg_Attributes$fontFamily = _elm_lang$virtual_dom$VirtualDom$attribute('font-family');
var _elm_lang$svg$Svg_Attributes$floodOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('flood-opacity');
var _elm_lang$svg$Svg_Attributes$floodColor = _elm_lang$virtual_dom$VirtualDom$attribute('flood-color');
var _elm_lang$svg$Svg_Attributes$filter = _elm_lang$virtual_dom$VirtualDom$attribute('filter');
var _elm_lang$svg$Svg_Attributes$fill = _elm_lang$virtual_dom$VirtualDom$attribute('fill');
var _elm_lang$svg$Svg_Attributes$fillRule = _elm_lang$virtual_dom$VirtualDom$attribute('fill-rule');
var _elm_lang$svg$Svg_Attributes$fillOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('fill-opacity');
var _elm_lang$svg$Svg_Attributes$enableBackground = _elm_lang$virtual_dom$VirtualDom$attribute('enable-background');
var _elm_lang$svg$Svg_Attributes$dominantBaseline = _elm_lang$virtual_dom$VirtualDom$attribute('dominant-baseline');
var _elm_lang$svg$Svg_Attributes$display = _elm_lang$virtual_dom$VirtualDom$attribute('display');
var _elm_lang$svg$Svg_Attributes$direction = _elm_lang$virtual_dom$VirtualDom$attribute('direction');
var _elm_lang$svg$Svg_Attributes$cursor = _elm_lang$virtual_dom$VirtualDom$attribute('cursor');
var _elm_lang$svg$Svg_Attributes$color = _elm_lang$virtual_dom$VirtualDom$attribute('color');
var _elm_lang$svg$Svg_Attributes$colorRendering = _elm_lang$virtual_dom$VirtualDom$attribute('color-rendering');
var _elm_lang$svg$Svg_Attributes$colorProfile = _elm_lang$virtual_dom$VirtualDom$attribute('color-profile');
var _elm_lang$svg$Svg_Attributes$colorInterpolation = _elm_lang$virtual_dom$VirtualDom$attribute('color-interpolation');
var _elm_lang$svg$Svg_Attributes$colorInterpolationFilters = _elm_lang$virtual_dom$VirtualDom$attribute('color-interpolation-filters');
var _elm_lang$svg$Svg_Attributes$clip = _elm_lang$virtual_dom$VirtualDom$attribute('clip');
var _elm_lang$svg$Svg_Attributes$clipRule = _elm_lang$virtual_dom$VirtualDom$attribute('clip-rule');
var _elm_lang$svg$Svg_Attributes$clipPath = _elm_lang$virtual_dom$VirtualDom$attribute('clip-path');
var _elm_lang$svg$Svg_Attributes$baselineShift = _elm_lang$virtual_dom$VirtualDom$attribute('baseline-shift');
var _elm_lang$svg$Svg_Attributes$alignmentBaseline = _elm_lang$virtual_dom$VirtualDom$attribute('alignment-baseline');
var _elm_lang$svg$Svg_Attributes$zoomAndPan = _elm_lang$virtual_dom$VirtualDom$attribute('zoomAndPan');
var _elm_lang$svg$Svg_Attributes$z = _elm_lang$virtual_dom$VirtualDom$attribute('z');
var _elm_lang$svg$Svg_Attributes$yChannelSelector = _elm_lang$virtual_dom$VirtualDom$attribute('yChannelSelector');
var _elm_lang$svg$Svg_Attributes$y2 = _elm_lang$virtual_dom$VirtualDom$attribute('y2');
var _elm_lang$svg$Svg_Attributes$y1 = _elm_lang$virtual_dom$VirtualDom$attribute('y1');
var _elm_lang$svg$Svg_Attributes$y = _elm_lang$virtual_dom$VirtualDom$attribute('y');
var _elm_lang$svg$Svg_Attributes$xmlSpace = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:space');
var _elm_lang$svg$Svg_Attributes$xmlLang = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:lang');
var _elm_lang$svg$Svg_Attributes$xmlBase = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:base');
var _elm_lang$svg$Svg_Attributes$xlinkType = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:type');
var _elm_lang$svg$Svg_Attributes$xlinkTitle = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:title');
var _elm_lang$svg$Svg_Attributes$xlinkShow = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:show');
var _elm_lang$svg$Svg_Attributes$xlinkRole = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:role');
var _elm_lang$svg$Svg_Attributes$xlinkHref = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:href');
var _elm_lang$svg$Svg_Attributes$xlinkArcrole = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:arcrole');
var _elm_lang$svg$Svg_Attributes$xlinkActuate = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:actuate');
var _elm_lang$svg$Svg_Attributes$xChannelSelector = _elm_lang$virtual_dom$VirtualDom$attribute('xChannelSelector');
var _elm_lang$svg$Svg_Attributes$x2 = _elm_lang$virtual_dom$VirtualDom$attribute('x2');
var _elm_lang$svg$Svg_Attributes$x1 = _elm_lang$virtual_dom$VirtualDom$attribute('x1');
var _elm_lang$svg$Svg_Attributes$xHeight = _elm_lang$virtual_dom$VirtualDom$attribute('x-height');
var _elm_lang$svg$Svg_Attributes$x = _elm_lang$virtual_dom$VirtualDom$attribute('x');
var _elm_lang$svg$Svg_Attributes$widths = _elm_lang$virtual_dom$VirtualDom$attribute('widths');
var _elm_lang$svg$Svg_Attributes$width = _elm_lang$virtual_dom$VirtualDom$attribute('width');
var _elm_lang$svg$Svg_Attributes$viewTarget = _elm_lang$virtual_dom$VirtualDom$attribute('viewTarget');
var _elm_lang$svg$Svg_Attributes$viewBox = _elm_lang$virtual_dom$VirtualDom$attribute('viewBox');
var _elm_lang$svg$Svg_Attributes$vertOriginY = _elm_lang$virtual_dom$VirtualDom$attribute('vert-origin-y');
var _elm_lang$svg$Svg_Attributes$vertOriginX = _elm_lang$virtual_dom$VirtualDom$attribute('vert-origin-x');
var _elm_lang$svg$Svg_Attributes$vertAdvY = _elm_lang$virtual_dom$VirtualDom$attribute('vert-adv-y');
var _elm_lang$svg$Svg_Attributes$version = _elm_lang$virtual_dom$VirtualDom$attribute('version');
var _elm_lang$svg$Svg_Attributes$values = _elm_lang$virtual_dom$VirtualDom$attribute('values');
var _elm_lang$svg$Svg_Attributes$vMathematical = _elm_lang$virtual_dom$VirtualDom$attribute('v-mathematical');
var _elm_lang$svg$Svg_Attributes$vIdeographic = _elm_lang$virtual_dom$VirtualDom$attribute('v-ideographic');
var _elm_lang$svg$Svg_Attributes$vHanging = _elm_lang$virtual_dom$VirtualDom$attribute('v-hanging');
var _elm_lang$svg$Svg_Attributes$vAlphabetic = _elm_lang$virtual_dom$VirtualDom$attribute('v-alphabetic');
var _elm_lang$svg$Svg_Attributes$unitsPerEm = _elm_lang$virtual_dom$VirtualDom$attribute('units-per-em');
var _elm_lang$svg$Svg_Attributes$unicodeRange = _elm_lang$virtual_dom$VirtualDom$attribute('unicode-range');
var _elm_lang$svg$Svg_Attributes$unicode = _elm_lang$virtual_dom$VirtualDom$attribute('unicode');
var _elm_lang$svg$Svg_Attributes$underlineThickness = _elm_lang$virtual_dom$VirtualDom$attribute('underline-thickness');
var _elm_lang$svg$Svg_Attributes$underlinePosition = _elm_lang$virtual_dom$VirtualDom$attribute('underline-position');
var _elm_lang$svg$Svg_Attributes$u2 = _elm_lang$virtual_dom$VirtualDom$attribute('u2');
var _elm_lang$svg$Svg_Attributes$u1 = _elm_lang$virtual_dom$VirtualDom$attribute('u1');
var _elm_lang$svg$Svg_Attributes$type_ = _elm_lang$virtual_dom$VirtualDom$attribute('type');
var _elm_lang$svg$Svg_Attributes$transform = _elm_lang$virtual_dom$VirtualDom$attribute('transform');
var _elm_lang$svg$Svg_Attributes$to = _elm_lang$virtual_dom$VirtualDom$attribute('to');
var _elm_lang$svg$Svg_Attributes$title = _elm_lang$virtual_dom$VirtualDom$attribute('title');
var _elm_lang$svg$Svg_Attributes$textLength = _elm_lang$virtual_dom$VirtualDom$attribute('textLength');
var _elm_lang$svg$Svg_Attributes$targetY = _elm_lang$virtual_dom$VirtualDom$attribute('targetY');
var _elm_lang$svg$Svg_Attributes$targetX = _elm_lang$virtual_dom$VirtualDom$attribute('targetX');
var _elm_lang$svg$Svg_Attributes$target = _elm_lang$virtual_dom$VirtualDom$attribute('target');
var _elm_lang$svg$Svg_Attributes$tableValues = _elm_lang$virtual_dom$VirtualDom$attribute('tableValues');
var _elm_lang$svg$Svg_Attributes$systemLanguage = _elm_lang$virtual_dom$VirtualDom$attribute('systemLanguage');
var _elm_lang$svg$Svg_Attributes$surfaceScale = _elm_lang$virtual_dom$VirtualDom$attribute('surfaceScale');
var _elm_lang$svg$Svg_Attributes$style = _elm_lang$virtual_dom$VirtualDom$attribute('style');
var _elm_lang$svg$Svg_Attributes$string = _elm_lang$virtual_dom$VirtualDom$attribute('string');
var _elm_lang$svg$Svg_Attributes$strikethroughThickness = _elm_lang$virtual_dom$VirtualDom$attribute('strikethrough-thickness');
var _elm_lang$svg$Svg_Attributes$strikethroughPosition = _elm_lang$virtual_dom$VirtualDom$attribute('strikethrough-position');
var _elm_lang$svg$Svg_Attributes$stitchTiles = _elm_lang$virtual_dom$VirtualDom$attribute('stitchTiles');
var _elm_lang$svg$Svg_Attributes$stemv = _elm_lang$virtual_dom$VirtualDom$attribute('stemv');
var _elm_lang$svg$Svg_Attributes$stemh = _elm_lang$virtual_dom$VirtualDom$attribute('stemh');
var _elm_lang$svg$Svg_Attributes$stdDeviation = _elm_lang$virtual_dom$VirtualDom$attribute('stdDeviation');
var _elm_lang$svg$Svg_Attributes$startOffset = _elm_lang$virtual_dom$VirtualDom$attribute('startOffset');
var _elm_lang$svg$Svg_Attributes$spreadMethod = _elm_lang$virtual_dom$VirtualDom$attribute('spreadMethod');
var _elm_lang$svg$Svg_Attributes$speed = _elm_lang$virtual_dom$VirtualDom$attribute('speed');
var _elm_lang$svg$Svg_Attributes$specularExponent = _elm_lang$virtual_dom$VirtualDom$attribute('specularExponent');
var _elm_lang$svg$Svg_Attributes$specularConstant = _elm_lang$virtual_dom$VirtualDom$attribute('specularConstant');
var _elm_lang$svg$Svg_Attributes$spacing = _elm_lang$virtual_dom$VirtualDom$attribute('spacing');
var _elm_lang$svg$Svg_Attributes$slope = _elm_lang$virtual_dom$VirtualDom$attribute('slope');
var _elm_lang$svg$Svg_Attributes$seed = _elm_lang$virtual_dom$VirtualDom$attribute('seed');
var _elm_lang$svg$Svg_Attributes$scale = _elm_lang$virtual_dom$VirtualDom$attribute('scale');
var _elm_lang$svg$Svg_Attributes$ry = _elm_lang$virtual_dom$VirtualDom$attribute('ry');
var _elm_lang$svg$Svg_Attributes$rx = _elm_lang$virtual_dom$VirtualDom$attribute('rx');
var _elm_lang$svg$Svg_Attributes$rotate = _elm_lang$virtual_dom$VirtualDom$attribute('rotate');
var _elm_lang$svg$Svg_Attributes$result = _elm_lang$virtual_dom$VirtualDom$attribute('result');
var _elm_lang$svg$Svg_Attributes$restart = _elm_lang$virtual_dom$VirtualDom$attribute('restart');
var _elm_lang$svg$Svg_Attributes$requiredFeatures = _elm_lang$virtual_dom$VirtualDom$attribute('requiredFeatures');
var _elm_lang$svg$Svg_Attributes$requiredExtensions = _elm_lang$virtual_dom$VirtualDom$attribute('requiredExtensions');
var _elm_lang$svg$Svg_Attributes$repeatDur = _elm_lang$virtual_dom$VirtualDom$attribute('repeatDur');
var _elm_lang$svg$Svg_Attributes$repeatCount = _elm_lang$virtual_dom$VirtualDom$attribute('repeatCount');
var _elm_lang$svg$Svg_Attributes$renderingIntent = _elm_lang$virtual_dom$VirtualDom$attribute('rendering-intent');
var _elm_lang$svg$Svg_Attributes$refY = _elm_lang$virtual_dom$VirtualDom$attribute('refY');
var _elm_lang$svg$Svg_Attributes$refX = _elm_lang$virtual_dom$VirtualDom$attribute('refX');
var _elm_lang$svg$Svg_Attributes$radius = _elm_lang$virtual_dom$VirtualDom$attribute('radius');
var _elm_lang$svg$Svg_Attributes$r = _elm_lang$virtual_dom$VirtualDom$attribute('r');
var _elm_lang$svg$Svg_Attributes$primitiveUnits = _elm_lang$virtual_dom$VirtualDom$attribute('primitiveUnits');
var _elm_lang$svg$Svg_Attributes$preserveAspectRatio = _elm_lang$virtual_dom$VirtualDom$attribute('preserveAspectRatio');
var _elm_lang$svg$Svg_Attributes$preserveAlpha = _elm_lang$virtual_dom$VirtualDom$attribute('preserveAlpha');
var _elm_lang$svg$Svg_Attributes$pointsAtZ = _elm_lang$virtual_dom$VirtualDom$attribute('pointsAtZ');
var _elm_lang$svg$Svg_Attributes$pointsAtY = _elm_lang$virtual_dom$VirtualDom$attribute('pointsAtY');
var _elm_lang$svg$Svg_Attributes$pointsAtX = _elm_lang$virtual_dom$VirtualDom$attribute('pointsAtX');
var _elm_lang$svg$Svg_Attributes$points = _elm_lang$virtual_dom$VirtualDom$attribute('points');
var _elm_lang$svg$Svg_Attributes$pointOrder = _elm_lang$virtual_dom$VirtualDom$attribute('point-order');
var _elm_lang$svg$Svg_Attributes$patternUnits = _elm_lang$virtual_dom$VirtualDom$attribute('patternUnits');
var _elm_lang$svg$Svg_Attributes$patternTransform = _elm_lang$virtual_dom$VirtualDom$attribute('patternTransform');
var _elm_lang$svg$Svg_Attributes$patternContentUnits = _elm_lang$virtual_dom$VirtualDom$attribute('patternContentUnits');
var _elm_lang$svg$Svg_Attributes$pathLength = _elm_lang$virtual_dom$VirtualDom$attribute('pathLength');
var _elm_lang$svg$Svg_Attributes$path = _elm_lang$virtual_dom$VirtualDom$attribute('path');
var _elm_lang$svg$Svg_Attributes$panose1 = _elm_lang$virtual_dom$VirtualDom$attribute('panose-1');
var _elm_lang$svg$Svg_Attributes$overlineThickness = _elm_lang$virtual_dom$VirtualDom$attribute('overline-thickness');
var _elm_lang$svg$Svg_Attributes$overlinePosition = _elm_lang$virtual_dom$VirtualDom$attribute('overline-position');
var _elm_lang$svg$Svg_Attributes$origin = _elm_lang$virtual_dom$VirtualDom$attribute('origin');
var _elm_lang$svg$Svg_Attributes$orientation = _elm_lang$virtual_dom$VirtualDom$attribute('orientation');
var _elm_lang$svg$Svg_Attributes$orient = _elm_lang$virtual_dom$VirtualDom$attribute('orient');
var _elm_lang$svg$Svg_Attributes$order = _elm_lang$virtual_dom$VirtualDom$attribute('order');
var _elm_lang$svg$Svg_Attributes$operator = _elm_lang$virtual_dom$VirtualDom$attribute('operator');
var _elm_lang$svg$Svg_Attributes$offset = _elm_lang$virtual_dom$VirtualDom$attribute('offset');
var _elm_lang$svg$Svg_Attributes$numOctaves = _elm_lang$virtual_dom$VirtualDom$attribute('numOctaves');
var _elm_lang$svg$Svg_Attributes$name = _elm_lang$virtual_dom$VirtualDom$attribute('name');
var _elm_lang$svg$Svg_Attributes$mode = _elm_lang$virtual_dom$VirtualDom$attribute('mode');
var _elm_lang$svg$Svg_Attributes$min = _elm_lang$virtual_dom$VirtualDom$attribute('min');
var _elm_lang$svg$Svg_Attributes$method = _elm_lang$virtual_dom$VirtualDom$attribute('method');
var _elm_lang$svg$Svg_Attributes$media = _elm_lang$virtual_dom$VirtualDom$attribute('media');
var _elm_lang$svg$Svg_Attributes$max = _elm_lang$virtual_dom$VirtualDom$attribute('max');
var _elm_lang$svg$Svg_Attributes$mathematical = _elm_lang$virtual_dom$VirtualDom$attribute('mathematical');
var _elm_lang$svg$Svg_Attributes$maskUnits = _elm_lang$virtual_dom$VirtualDom$attribute('maskUnits');
var _elm_lang$svg$Svg_Attributes$maskContentUnits = _elm_lang$virtual_dom$VirtualDom$attribute('maskContentUnits');
var _elm_lang$svg$Svg_Attributes$markerWidth = _elm_lang$virtual_dom$VirtualDom$attribute('markerWidth');
var _elm_lang$svg$Svg_Attributes$markerUnits = _elm_lang$virtual_dom$VirtualDom$attribute('markerUnits');
var _elm_lang$svg$Svg_Attributes$markerHeight = _elm_lang$virtual_dom$VirtualDom$attribute('markerHeight');
var _elm_lang$svg$Svg_Attributes$local = _elm_lang$virtual_dom$VirtualDom$attribute('local');
var _elm_lang$svg$Svg_Attributes$limitingConeAngle = _elm_lang$virtual_dom$VirtualDom$attribute('limitingConeAngle');
var _elm_lang$svg$Svg_Attributes$lengthAdjust = _elm_lang$virtual_dom$VirtualDom$attribute('lengthAdjust');
var _elm_lang$svg$Svg_Attributes$lang = _elm_lang$virtual_dom$VirtualDom$attribute('lang');
var _elm_lang$svg$Svg_Attributes$keyTimes = _elm_lang$virtual_dom$VirtualDom$attribute('keyTimes');
var _elm_lang$svg$Svg_Attributes$keySplines = _elm_lang$virtual_dom$VirtualDom$attribute('keySplines');
var _elm_lang$svg$Svg_Attributes$keyPoints = _elm_lang$virtual_dom$VirtualDom$attribute('keyPoints');
var _elm_lang$svg$Svg_Attributes$kernelUnitLength = _elm_lang$virtual_dom$VirtualDom$attribute('kernelUnitLength');
var _elm_lang$svg$Svg_Attributes$kernelMatrix = _elm_lang$virtual_dom$VirtualDom$attribute('kernelMatrix');
var _elm_lang$svg$Svg_Attributes$k4 = _elm_lang$virtual_dom$VirtualDom$attribute('k4');
var _elm_lang$svg$Svg_Attributes$k3 = _elm_lang$virtual_dom$VirtualDom$attribute('k3');
var _elm_lang$svg$Svg_Attributes$k2 = _elm_lang$virtual_dom$VirtualDom$attribute('k2');
var _elm_lang$svg$Svg_Attributes$k1 = _elm_lang$virtual_dom$VirtualDom$attribute('k1');
var _elm_lang$svg$Svg_Attributes$k = _elm_lang$virtual_dom$VirtualDom$attribute('k');
var _elm_lang$svg$Svg_Attributes$intercept = _elm_lang$virtual_dom$VirtualDom$attribute('intercept');
var _elm_lang$svg$Svg_Attributes$in2 = _elm_lang$virtual_dom$VirtualDom$attribute('in2');
var _elm_lang$svg$Svg_Attributes$in_ = _elm_lang$virtual_dom$VirtualDom$attribute('in');
var _elm_lang$svg$Svg_Attributes$ideographic = _elm_lang$virtual_dom$VirtualDom$attribute('ideographic');
var _elm_lang$svg$Svg_Attributes$id = _elm_lang$virtual_dom$VirtualDom$attribute('id');
var _elm_lang$svg$Svg_Attributes$horizOriginY = _elm_lang$virtual_dom$VirtualDom$attribute('horiz-origin-y');
var _elm_lang$svg$Svg_Attributes$horizOriginX = _elm_lang$virtual_dom$VirtualDom$attribute('horiz-origin-x');
var _elm_lang$svg$Svg_Attributes$horizAdvX = _elm_lang$virtual_dom$VirtualDom$attribute('horiz-adv-x');
var _elm_lang$svg$Svg_Attributes$height = _elm_lang$virtual_dom$VirtualDom$attribute('height');
var _elm_lang$svg$Svg_Attributes$hanging = _elm_lang$virtual_dom$VirtualDom$attribute('hanging');
var _elm_lang$svg$Svg_Attributes$gradientUnits = _elm_lang$virtual_dom$VirtualDom$attribute('gradientUnits');
var _elm_lang$svg$Svg_Attributes$gradientTransform = _elm_lang$virtual_dom$VirtualDom$attribute('gradientTransform');
var _elm_lang$svg$Svg_Attributes$glyphRef = _elm_lang$virtual_dom$VirtualDom$attribute('glyphRef');
var _elm_lang$svg$Svg_Attributes$glyphName = _elm_lang$virtual_dom$VirtualDom$attribute('glyph-name');
var _elm_lang$svg$Svg_Attributes$g2 = _elm_lang$virtual_dom$VirtualDom$attribute('g2');
var _elm_lang$svg$Svg_Attributes$g1 = _elm_lang$virtual_dom$VirtualDom$attribute('g1');
var _elm_lang$svg$Svg_Attributes$fy = _elm_lang$virtual_dom$VirtualDom$attribute('fy');
var _elm_lang$svg$Svg_Attributes$fx = _elm_lang$virtual_dom$VirtualDom$attribute('fx');
var _elm_lang$svg$Svg_Attributes$from = _elm_lang$virtual_dom$VirtualDom$attribute('from');
var _elm_lang$svg$Svg_Attributes$format = _elm_lang$virtual_dom$VirtualDom$attribute('format');
var _elm_lang$svg$Svg_Attributes$filterUnits = _elm_lang$virtual_dom$VirtualDom$attribute('filterUnits');
var _elm_lang$svg$Svg_Attributes$filterRes = _elm_lang$virtual_dom$VirtualDom$attribute('filterRes');
var _elm_lang$svg$Svg_Attributes$externalResourcesRequired = _elm_lang$virtual_dom$VirtualDom$attribute('externalResourcesRequired');
var _elm_lang$svg$Svg_Attributes$exponent = _elm_lang$virtual_dom$VirtualDom$attribute('exponent');
var _elm_lang$svg$Svg_Attributes$end = _elm_lang$virtual_dom$VirtualDom$attribute('end');
var _elm_lang$svg$Svg_Attributes$elevation = _elm_lang$virtual_dom$VirtualDom$attribute('elevation');
var _elm_lang$svg$Svg_Attributes$edgeMode = _elm_lang$virtual_dom$VirtualDom$attribute('edgeMode');
var _elm_lang$svg$Svg_Attributes$dy = _elm_lang$virtual_dom$VirtualDom$attribute('dy');
var _elm_lang$svg$Svg_Attributes$dx = _elm_lang$virtual_dom$VirtualDom$attribute('dx');
var _elm_lang$svg$Svg_Attributes$dur = _elm_lang$virtual_dom$VirtualDom$attribute('dur');
var _elm_lang$svg$Svg_Attributes$divisor = _elm_lang$virtual_dom$VirtualDom$attribute('divisor');
var _elm_lang$svg$Svg_Attributes$diffuseConstant = _elm_lang$virtual_dom$VirtualDom$attribute('diffuseConstant');
var _elm_lang$svg$Svg_Attributes$descent = _elm_lang$virtual_dom$VirtualDom$attribute('descent');
var _elm_lang$svg$Svg_Attributes$decelerate = _elm_lang$virtual_dom$VirtualDom$attribute('decelerate');
var _elm_lang$svg$Svg_Attributes$d = _elm_lang$virtual_dom$VirtualDom$attribute('d');
var _elm_lang$svg$Svg_Attributes$cy = _elm_lang$virtual_dom$VirtualDom$attribute('cy');
var _elm_lang$svg$Svg_Attributes$cx = _elm_lang$virtual_dom$VirtualDom$attribute('cx');
var _elm_lang$svg$Svg_Attributes$contentStyleType = _elm_lang$virtual_dom$VirtualDom$attribute('contentStyleType');
var _elm_lang$svg$Svg_Attributes$contentScriptType = _elm_lang$virtual_dom$VirtualDom$attribute('contentScriptType');
var _elm_lang$svg$Svg_Attributes$clipPathUnits = _elm_lang$virtual_dom$VirtualDom$attribute('clipPathUnits');
var _elm_lang$svg$Svg_Attributes$class = _elm_lang$virtual_dom$VirtualDom$attribute('class');
var _elm_lang$svg$Svg_Attributes$capHeight = _elm_lang$virtual_dom$VirtualDom$attribute('cap-height');
var _elm_lang$svg$Svg_Attributes$calcMode = _elm_lang$virtual_dom$VirtualDom$attribute('calcMode');
var _elm_lang$svg$Svg_Attributes$by = _elm_lang$virtual_dom$VirtualDom$attribute('by');
var _elm_lang$svg$Svg_Attributes$bias = _elm_lang$virtual_dom$VirtualDom$attribute('bias');
var _elm_lang$svg$Svg_Attributes$begin = _elm_lang$virtual_dom$VirtualDom$attribute('begin');
var _elm_lang$svg$Svg_Attributes$bbox = _elm_lang$virtual_dom$VirtualDom$attribute('bbox');
var _elm_lang$svg$Svg_Attributes$baseProfile = _elm_lang$virtual_dom$VirtualDom$attribute('baseProfile');
var _elm_lang$svg$Svg_Attributes$baseFrequency = _elm_lang$virtual_dom$VirtualDom$attribute('baseFrequency');
var _elm_lang$svg$Svg_Attributes$azimuth = _elm_lang$virtual_dom$VirtualDom$attribute('azimuth');
var _elm_lang$svg$Svg_Attributes$autoReverse = _elm_lang$virtual_dom$VirtualDom$attribute('autoReverse');
var _elm_lang$svg$Svg_Attributes$attributeType = _elm_lang$virtual_dom$VirtualDom$attribute('attributeType');
var _elm_lang$svg$Svg_Attributes$attributeName = _elm_lang$virtual_dom$VirtualDom$attribute('attributeName');
var _elm_lang$svg$Svg_Attributes$ascent = _elm_lang$virtual_dom$VirtualDom$attribute('ascent');
var _elm_lang$svg$Svg_Attributes$arabicForm = _elm_lang$virtual_dom$VirtualDom$attribute('arabic-form');
var _elm_lang$svg$Svg_Attributes$amplitude = _elm_lang$virtual_dom$VirtualDom$attribute('amplitude');
var _elm_lang$svg$Svg_Attributes$allowReorder = _elm_lang$virtual_dom$VirtualDom$attribute('allowReorder');
var _elm_lang$svg$Svg_Attributes$alphabetic = _elm_lang$virtual_dom$VirtualDom$attribute('alphabetic');
var _elm_lang$svg$Svg_Attributes$additive = _elm_lang$virtual_dom$VirtualDom$attribute('additive');
var _elm_lang$svg$Svg_Attributes$accumulate = _elm_lang$virtual_dom$VirtualDom$attribute('accumulate');
var _elm_lang$svg$Svg_Attributes$accelerate = _elm_lang$virtual_dom$VirtualDom$attribute('accelerate');
var _elm_lang$svg$Svg_Attributes$accentHeight = _elm_lang$virtual_dom$VirtualDom$attribute('accent-height');

var _elm_lang$websocket$Native_WebSocket = function() {

function open(url, settings)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		try
		{
			var socket = new WebSocket(url);
			socket.elm_web_socket = true;
		}
		catch(err)
		{
			return callback(_elm_lang$core$Native_Scheduler.fail({
				ctor: err.name === 'SecurityError' ? 'BadSecurity' : 'BadArgs',
				_0: err.message
			}));
		}

		socket.addEventListener("open", function(event) {
			callback(_elm_lang$core$Native_Scheduler.succeed(socket));
		});

		socket.addEventListener("message", function(event) {
			_elm_lang$core$Native_Scheduler.rawSpawn(A2(settings.onMessage, socket, event.data));
		});

		socket.addEventListener("close", function(event) {
			_elm_lang$core$Native_Scheduler.rawSpawn(settings.onClose({
				code: event.code,
				reason: event.reason,
				wasClean: event.wasClean
			}));
		});

		return function()
		{
			if (socket && socket.close)
			{
				socket.close();
			}
		};
	});
}

function send(socket, string)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var result =
			socket.readyState === WebSocket.OPEN
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just({ ctor: 'NotOpen' });

		try
		{
			socket.send(string);
		}
		catch(err)
		{
			result = _elm_lang$core$Maybe$Just({ ctor: 'BadString' });
		}

		callback(_elm_lang$core$Native_Scheduler.succeed(result));
	});
}

function close(code, reason, socket)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		try
		{
			socket.close(code, reason);
		}
		catch(err)
		{
			return callback(_elm_lang$core$Native_Scheduler.fail(_elm_lang$core$Maybe$Just({
				ctor: err.name === 'SyntaxError' ? 'BadReason' : 'BadCode'
			})));
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Maybe$Nothing));
	});
}

function bytesQueued(socket)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		callback(_elm_lang$core$Native_Scheduler.succeed(socket.bufferedAmount));
	});
}

return {
	open: F2(open),
	send: F2(send),
	close: F3(close),
	bytesQueued: bytesQueued
};

}();

var _elm_lang$websocket$WebSocket_LowLevel$bytesQueued = _elm_lang$websocket$Native_WebSocket.bytesQueued;
var _elm_lang$websocket$WebSocket_LowLevel$send = _elm_lang$websocket$Native_WebSocket.send;
var _elm_lang$websocket$WebSocket_LowLevel$closeWith = _elm_lang$websocket$Native_WebSocket.close;
var _elm_lang$websocket$WebSocket_LowLevel$close = function (socket) {
	return A2(
		_elm_lang$core$Task$map,
		_elm_lang$core$Basics$always(
			{ctor: '_Tuple0'}),
		A3(_elm_lang$websocket$WebSocket_LowLevel$closeWith, 1000, '', socket));
};
var _elm_lang$websocket$WebSocket_LowLevel$open = _elm_lang$websocket$Native_WebSocket.open;
var _elm_lang$websocket$WebSocket_LowLevel$Settings = F2(
	function (a, b) {
		return {onMessage: a, onClose: b};
	});
var _elm_lang$websocket$WebSocket_LowLevel$WebSocket = {ctor: 'WebSocket'};
var _elm_lang$websocket$WebSocket_LowLevel$BadArgs = {ctor: 'BadArgs'};
var _elm_lang$websocket$WebSocket_LowLevel$BadSecurity = {ctor: 'BadSecurity'};
var _elm_lang$websocket$WebSocket_LowLevel$BadReason = {ctor: 'BadReason'};
var _elm_lang$websocket$WebSocket_LowLevel$BadCode = {ctor: 'BadCode'};
var _elm_lang$websocket$WebSocket_LowLevel$BadString = {ctor: 'BadString'};
var _elm_lang$websocket$WebSocket_LowLevel$NotOpen = {ctor: 'NotOpen'};

var _elm_lang$websocket$WebSocket$closeConnection = function (connection) {
	var _p0 = connection;
	if (_p0.ctor === 'Opening') {
		return _elm_lang$core$Process$kill(_p0._1);
	} else {
		return _elm_lang$websocket$WebSocket_LowLevel$close(_p0._0);
	}
};
var _elm_lang$websocket$WebSocket$after = function (backoff) {
	return (_elm_lang$core$Native_Utils.cmp(backoff, 1) < 0) ? _elm_lang$core$Task$succeed(
		{ctor: '_Tuple0'}) : _elm_lang$core$Process$sleep(
		_elm_lang$core$Basics$toFloat(
			10 * Math.pow(2, backoff)));
};
var _elm_lang$websocket$WebSocket$removeQueue = F2(
	function (name, state) {
		return _elm_lang$core$Native_Utils.update(
			state,
			{
				queues: A2(_elm_lang$core$Dict$remove, name, state.queues)
			});
	});
var _elm_lang$websocket$WebSocket$updateSocket = F3(
	function (name, connection, state) {
		return _elm_lang$core$Native_Utils.update(
			state,
			{
				sockets: A3(_elm_lang$core$Dict$insert, name, connection, state.sockets)
			});
	});
var _elm_lang$websocket$WebSocket$add = F2(
	function (value, maybeList) {
		var _p1 = maybeList;
		if (_p1.ctor === 'Nothing') {
			return _elm_lang$core$Maybe$Just(
				{
					ctor: '::',
					_0: value,
					_1: {ctor: '[]'}
				});
		} else {
			return _elm_lang$core$Maybe$Just(
				{ctor: '::', _0: value, _1: _p1._0});
		}
	});
var _elm_lang$websocket$WebSocket$buildSubDict = F2(
	function (subs, dict) {
		buildSubDict:
		while (true) {
			var _p2 = subs;
			if (_p2.ctor === '[]') {
				return dict;
			} else {
				if (_p2._0.ctor === 'Listen') {
					var _v3 = _p2._1,
						_v4 = A3(
						_elm_lang$core$Dict$update,
						_p2._0._0,
						_elm_lang$websocket$WebSocket$add(_p2._0._1),
						dict);
					subs = _v3;
					dict = _v4;
					continue buildSubDict;
				} else {
					var _v5 = _p2._1,
						_v6 = A3(
						_elm_lang$core$Dict$update,
						_p2._0._0,
						function (_p3) {
							return _elm_lang$core$Maybe$Just(
								A2(
									_elm_lang$core$Maybe$withDefault,
									{ctor: '[]'},
									_p3));
						},
						dict);
					subs = _v5;
					dict = _v6;
					continue buildSubDict;
				}
			}
		}
	});
var _elm_lang$websocket$WebSocket_ops = _elm_lang$websocket$WebSocket_ops || {};
_elm_lang$websocket$WebSocket_ops['&>'] = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p4) {
				return t2;
			},
			t1);
	});
var _elm_lang$websocket$WebSocket$sendMessagesHelp = F3(
	function (cmds, socketsDict, queuesDict) {
		sendMessagesHelp:
		while (true) {
			var _p5 = cmds;
			if (_p5.ctor === '[]') {
				return _elm_lang$core$Task$succeed(queuesDict);
			} else {
				var _p9 = _p5._1;
				var _p8 = _p5._0._0;
				var _p7 = _p5._0._1;
				var _p6 = A2(_elm_lang$core$Dict$get, _p8, socketsDict);
				if ((_p6.ctor === 'Just') && (_p6._0.ctor === 'Connected')) {
					return A2(
						_elm_lang$websocket$WebSocket_ops['&>'],
						A2(_elm_lang$websocket$WebSocket_LowLevel$send, _p6._0._0, _p7),
						A3(_elm_lang$websocket$WebSocket$sendMessagesHelp, _p9, socketsDict, queuesDict));
				} else {
					var _v9 = _p9,
						_v10 = socketsDict,
						_v11 = A3(
						_elm_lang$core$Dict$update,
						_p8,
						_elm_lang$websocket$WebSocket$add(_p7),
						queuesDict);
					cmds = _v9;
					socketsDict = _v10;
					queuesDict = _v11;
					continue sendMessagesHelp;
				}
			}
		}
	});
var _elm_lang$websocket$WebSocket$subscription = _elm_lang$core$Native_Platform.leaf('WebSocket');
var _elm_lang$websocket$WebSocket$command = _elm_lang$core$Native_Platform.leaf('WebSocket');
var _elm_lang$websocket$WebSocket$State = F3(
	function (a, b, c) {
		return {sockets: a, queues: b, subs: c};
	});
var _elm_lang$websocket$WebSocket$init = _elm_lang$core$Task$succeed(
	A3(_elm_lang$websocket$WebSocket$State, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty));
var _elm_lang$websocket$WebSocket$Send = F2(
	function (a, b) {
		return {ctor: 'Send', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$send = F2(
	function (url, message) {
		return _elm_lang$websocket$WebSocket$command(
			A2(_elm_lang$websocket$WebSocket$Send, url, message));
	});
var _elm_lang$websocket$WebSocket$cmdMap = F2(
	function (_p11, _p10) {
		var _p12 = _p10;
		return A2(_elm_lang$websocket$WebSocket$Send, _p12._0, _p12._1);
	});
var _elm_lang$websocket$WebSocket$KeepAlive = function (a) {
	return {ctor: 'KeepAlive', _0: a};
};
var _elm_lang$websocket$WebSocket$keepAlive = function (url) {
	return _elm_lang$websocket$WebSocket$subscription(
		_elm_lang$websocket$WebSocket$KeepAlive(url));
};
var _elm_lang$websocket$WebSocket$Listen = F2(
	function (a, b) {
		return {ctor: 'Listen', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$listen = F2(
	function (url, tagger) {
		return _elm_lang$websocket$WebSocket$subscription(
			A2(_elm_lang$websocket$WebSocket$Listen, url, tagger));
	});
var _elm_lang$websocket$WebSocket$subMap = F2(
	function (func, sub) {
		var _p13 = sub;
		if (_p13.ctor === 'Listen') {
			return A2(
				_elm_lang$websocket$WebSocket$Listen,
				_p13._0,
				function (_p14) {
					return func(
						_p13._1(_p14));
				});
		} else {
			return _elm_lang$websocket$WebSocket$KeepAlive(_p13._0);
		}
	});
var _elm_lang$websocket$WebSocket$Connected = function (a) {
	return {ctor: 'Connected', _0: a};
};
var _elm_lang$websocket$WebSocket$Opening = F2(
	function (a, b) {
		return {ctor: 'Opening', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$BadOpen = function (a) {
	return {ctor: 'BadOpen', _0: a};
};
var _elm_lang$websocket$WebSocket$GoodOpen = F2(
	function (a, b) {
		return {ctor: 'GoodOpen', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$Die = function (a) {
	return {ctor: 'Die', _0: a};
};
var _elm_lang$websocket$WebSocket$Receive = F2(
	function (a, b) {
		return {ctor: 'Receive', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$open = F2(
	function (name, router) {
		return A2(
			_elm_lang$websocket$WebSocket_LowLevel$open,
			name,
			{
				onMessage: F2(
					function (_p15, msg) {
						return A2(
							_elm_lang$core$Platform$sendToSelf,
							router,
							A2(_elm_lang$websocket$WebSocket$Receive, name, msg));
					}),
				onClose: function (details) {
					return A2(
						_elm_lang$core$Platform$sendToSelf,
						router,
						_elm_lang$websocket$WebSocket$Die(name));
				}
			});
	});
var _elm_lang$websocket$WebSocket$attemptOpen = F3(
	function (router, backoff, name) {
		var badOpen = function (_p16) {
			return A2(
				_elm_lang$core$Platform$sendToSelf,
				router,
				_elm_lang$websocket$WebSocket$BadOpen(name));
		};
		var goodOpen = function (ws) {
			return A2(
				_elm_lang$core$Platform$sendToSelf,
				router,
				A2(_elm_lang$websocket$WebSocket$GoodOpen, name, ws));
		};
		var actuallyAttemptOpen = A2(
			_elm_lang$core$Task$onError,
			badOpen,
			A2(
				_elm_lang$core$Task$andThen,
				goodOpen,
				A2(_elm_lang$websocket$WebSocket$open, name, router)));
		return _elm_lang$core$Process$spawn(
			A2(
				_elm_lang$websocket$WebSocket_ops['&>'],
				_elm_lang$websocket$WebSocket$after(backoff),
				actuallyAttemptOpen));
	});
var _elm_lang$websocket$WebSocket$onEffects = F4(
	function (router, cmds, subs, state) {
		var newSubs = A2(_elm_lang$websocket$WebSocket$buildSubDict, subs, _elm_lang$core$Dict$empty);
		var cleanup = function (newQueues) {
			var rightStep = F3(
				function (name, connection, getNewSockets) {
					return A2(
						_elm_lang$websocket$WebSocket_ops['&>'],
						_elm_lang$websocket$WebSocket$closeConnection(connection),
						getNewSockets);
				});
			var bothStep = F4(
				function (name, _p17, connection, getNewSockets) {
					return A2(
						_elm_lang$core$Task$map,
						A2(_elm_lang$core$Dict$insert, name, connection),
						getNewSockets);
				});
			var leftStep = F3(
				function (name, _p18, getNewSockets) {
					return A2(
						_elm_lang$core$Task$andThen,
						function (newSockets) {
							return A2(
								_elm_lang$core$Task$andThen,
								function (pid) {
									return _elm_lang$core$Task$succeed(
										A3(
											_elm_lang$core$Dict$insert,
											name,
											A2(_elm_lang$websocket$WebSocket$Opening, 0, pid),
											newSockets));
								},
								A3(_elm_lang$websocket$WebSocket$attemptOpen, router, 0, name));
						},
						getNewSockets);
				});
			var newEntries = A2(
				_elm_lang$core$Dict$union,
				newQueues,
				A2(
					_elm_lang$core$Dict$map,
					F2(
						function (k, v) {
							return {ctor: '[]'};
						}),
					newSubs));
			var collectNewSockets = A6(
				_elm_lang$core$Dict$merge,
				leftStep,
				bothStep,
				rightStep,
				newEntries,
				state.sockets,
				_elm_lang$core$Task$succeed(_elm_lang$core$Dict$empty));
			return A2(
				_elm_lang$core$Task$andThen,
				function (newSockets) {
					return _elm_lang$core$Task$succeed(
						A3(_elm_lang$websocket$WebSocket$State, newSockets, newQueues, newSubs));
				},
				collectNewSockets);
		};
		var sendMessagesGetNewQueues = A3(_elm_lang$websocket$WebSocket$sendMessagesHelp, cmds, state.sockets, state.queues);
		return A2(_elm_lang$core$Task$andThen, cleanup, sendMessagesGetNewQueues);
	});
var _elm_lang$websocket$WebSocket$onSelfMsg = F3(
	function (router, selfMsg, state) {
		var _p19 = selfMsg;
		switch (_p19.ctor) {
			case 'Receive':
				var sends = A2(
					_elm_lang$core$List$map,
					function (tagger) {
						return A2(
							_elm_lang$core$Platform$sendToApp,
							router,
							tagger(_p19._1));
					},
					A2(
						_elm_lang$core$Maybe$withDefault,
						{ctor: '[]'},
						A2(_elm_lang$core$Dict$get, _p19._0, state.subs)));
				return A2(
					_elm_lang$websocket$WebSocket_ops['&>'],
					_elm_lang$core$Task$sequence(sends),
					_elm_lang$core$Task$succeed(state));
			case 'Die':
				var _p21 = _p19._0;
				var _p20 = A2(_elm_lang$core$Dict$get, _p21, state.sockets);
				if (_p20.ctor === 'Nothing') {
					return _elm_lang$core$Task$succeed(state);
				} else {
					return A2(
						_elm_lang$core$Task$andThen,
						function (pid) {
							return _elm_lang$core$Task$succeed(
								A3(
									_elm_lang$websocket$WebSocket$updateSocket,
									_p21,
									A2(_elm_lang$websocket$WebSocket$Opening, 0, pid),
									state));
						},
						A3(_elm_lang$websocket$WebSocket$attemptOpen, router, 0, _p21));
				}
			case 'GoodOpen':
				var _p24 = _p19._1;
				var _p23 = _p19._0;
				var _p22 = A2(_elm_lang$core$Dict$get, _p23, state.queues);
				if (_p22.ctor === 'Nothing') {
					return _elm_lang$core$Task$succeed(
						A3(
							_elm_lang$websocket$WebSocket$updateSocket,
							_p23,
							_elm_lang$websocket$WebSocket$Connected(_p24),
							state));
				} else {
					return A3(
						_elm_lang$core$List$foldl,
						F2(
							function (msg, task) {
								return A2(
									_elm_lang$websocket$WebSocket_ops['&>'],
									A2(_elm_lang$websocket$WebSocket_LowLevel$send, _p24, msg),
									task);
							}),
						_elm_lang$core$Task$succeed(
							A2(
								_elm_lang$websocket$WebSocket$removeQueue,
								_p23,
								A3(
									_elm_lang$websocket$WebSocket$updateSocket,
									_p23,
									_elm_lang$websocket$WebSocket$Connected(_p24),
									state))),
						_p22._0);
				}
			default:
				var _p27 = _p19._0;
				var _p25 = A2(_elm_lang$core$Dict$get, _p27, state.sockets);
				if (_p25.ctor === 'Nothing') {
					return _elm_lang$core$Task$succeed(state);
				} else {
					if (_p25._0.ctor === 'Opening') {
						var _p26 = _p25._0._0;
						return A2(
							_elm_lang$core$Task$andThen,
							function (pid) {
								return _elm_lang$core$Task$succeed(
									A3(
										_elm_lang$websocket$WebSocket$updateSocket,
										_p27,
										A2(_elm_lang$websocket$WebSocket$Opening, _p26 + 1, pid),
										state));
							},
							A3(_elm_lang$websocket$WebSocket$attemptOpen, router, _p26 + 1, _p27));
					} else {
						return _elm_lang$core$Task$succeed(state);
					}
				}
		}
	});
_elm_lang$core$Native_Platform.effectManagers['WebSocket'] = {pkg: 'elm-lang/websocket', init: _elm_lang$websocket$WebSocket$init, onEffects: _elm_lang$websocket$WebSocket$onEffects, onSelfMsg: _elm_lang$websocket$WebSocket$onSelfMsg, tag: 'fx', cmdMap: _elm_lang$websocket$WebSocket$cmdMap, subMap: _elm_lang$websocket$WebSocket$subMap};

var _elm_lang$window$Native_Window = function()
{

var size = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)	{
	callback(_elm_lang$core$Native_Scheduler.succeed({
		width: window.innerWidth,
		height: window.innerHeight
	}));
});

return {
	size: size
};

}();
var _elm_lang$window$Window_ops = _elm_lang$window$Window_ops || {};
_elm_lang$window$Window_ops['&>'] = F2(
	function (task1, task2) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p0) {
				return task2;
			},
			task1);
	});
var _elm_lang$window$Window$onSelfMsg = F3(
	function (router, dimensions, state) {
		var _p1 = state;
		if (_p1.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			var send = function (_p2) {
				var _p3 = _p2;
				return A2(
					_elm_lang$core$Platform$sendToApp,
					router,
					_p3._0(dimensions));
			};
			return A2(
				_elm_lang$window$Window_ops['&>'],
				_elm_lang$core$Task$sequence(
					A2(_elm_lang$core$List$map, send, _p1._0.subs)),
				_elm_lang$core$Task$succeed(state));
		}
	});
var _elm_lang$window$Window$init = _elm_lang$core$Task$succeed(_elm_lang$core$Maybe$Nothing);
var _elm_lang$window$Window$size = _elm_lang$window$Native_Window.size;
var _elm_lang$window$Window$width = A2(
	_elm_lang$core$Task$map,
	function (_) {
		return _.width;
	},
	_elm_lang$window$Window$size);
var _elm_lang$window$Window$height = A2(
	_elm_lang$core$Task$map,
	function (_) {
		return _.height;
	},
	_elm_lang$window$Window$size);
var _elm_lang$window$Window$onEffects = F3(
	function (router, newSubs, oldState) {
		var _p4 = {ctor: '_Tuple2', _0: oldState, _1: newSubs};
		if (_p4._0.ctor === 'Nothing') {
			if (_p4._1.ctor === '[]') {
				return _elm_lang$core$Task$succeed(_elm_lang$core$Maybe$Nothing);
			} else {
				return A2(
					_elm_lang$core$Task$andThen,
					function (pid) {
						return _elm_lang$core$Task$succeed(
							_elm_lang$core$Maybe$Just(
								{subs: newSubs, pid: pid}));
					},
					_elm_lang$core$Process$spawn(
						A3(
							_elm_lang$dom$Dom_LowLevel$onWindow,
							'resize',
							_elm_lang$core$Json_Decode$succeed(
								{ctor: '_Tuple0'}),
							function (_p5) {
								return A2(
									_elm_lang$core$Task$andThen,
									_elm_lang$core$Platform$sendToSelf(router),
									_elm_lang$window$Window$size);
							})));
			}
		} else {
			if (_p4._1.ctor === '[]') {
				return A2(
					_elm_lang$window$Window_ops['&>'],
					_elm_lang$core$Process$kill(_p4._0._0.pid),
					_elm_lang$core$Task$succeed(_elm_lang$core$Maybe$Nothing));
			} else {
				return _elm_lang$core$Task$succeed(
					_elm_lang$core$Maybe$Just(
						{subs: newSubs, pid: _p4._0._0.pid}));
			}
		}
	});
var _elm_lang$window$Window$subscription = _elm_lang$core$Native_Platform.leaf('Window');
var _elm_lang$window$Window$Size = F2(
	function (a, b) {
		return {width: a, height: b};
	});
var _elm_lang$window$Window$MySub = function (a) {
	return {ctor: 'MySub', _0: a};
};
var _elm_lang$window$Window$resizes = function (tagger) {
	return _elm_lang$window$Window$subscription(
		_elm_lang$window$Window$MySub(tagger));
};
var _elm_lang$window$Window$subMap = F2(
	function (func, _p6) {
		var _p7 = _p6;
		return _elm_lang$window$Window$MySub(
			function (_p8) {
				return func(
					_p7._0(_p8));
			});
	});
_elm_lang$core$Native_Platform.effectManagers['Window'] = {pkg: 'elm-lang/window', init: _elm_lang$window$Window$init, onEffects: _elm_lang$window$Window$onEffects, onSelfMsg: _elm_lang$window$Window$onSelfMsg, tag: 'sub', subMap: _elm_lang$window$Window$subMap};

var _evancz$elm_markdown$Native_Markdown = function() {


// VIRTUAL-DOM WIDGETS

function toHtml(options, factList, rawMarkdown)
{
	var model = {
		options: options,
		markdown: rawMarkdown
	};
	return _elm_lang$virtual_dom$Native_VirtualDom.custom(factList, model, implementation);
}


// WIDGET IMPLEMENTATION

var implementation = {
	render: render,
	diff: diff
};

function render(model)
{
	var html = marked(model.markdown, formatOptions(model.options));
	var div = document.createElement('div');
	div.innerHTML = html;
	return div;
}

function diff(a, b)
{
	
	if (a.model.markdown === b.model.markdown && a.model.options === b.model.options)
	{
		return null;
	}

	return {
		applyPatch: applyPatch,
		data: marked(b.model.markdown, formatOptions(b.model.options))
	};
}

function applyPatch(domNode, data)
{
	domNode.innerHTML = data;
	return domNode;
}


// ACTUAL MARKDOWN PARSER

var marked = function() {
	// catch the `marked` object regardless of the outer environment.
	// (ex. a CommonJS module compatible environment.)
	// note that this depends on marked's implementation of environment detection.
	var module = {};
	var exports = module.exports = {};

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,paragraph:/^/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:cap[1]==="pre"||cap[1]==="script"||cap[1]==="style",text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=escape(this.smartypants(cap[0]));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/--/g,"—").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&([#\w]+);/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	return module.exports;
}();


// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

function formatOptions(options)
{
	function toHighlight(code, lang)
	{
		if (!lang && options.defaultHighlighting.ctor === 'Just')
		{
			lang = options.defaultHighlighting._0;
		}

		if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0)
		{
			return hljs.highlight(lang, code, true).value;
		}

		return code;
	}

	var gfm = options.githubFlavored;
	if (gfm.ctor === 'Just')
	{
		return {
			highlight: toHighlight,
			gfm: true,
			tables: gfm._0.tables,
			breaks: gfm._0.breaks,
			sanitize: options.sanitize,
			smartypants: options.smartypants
		};
	}

	return {
		highlight: toHighlight,
		gfm: false,
		tables: false,
		breaks: false,
		sanitize: options.sanitize,
		smartypants: options.smartypants
	};
}


// EXPORTS

return {
	toHtml: F3(toHtml)
};

}();

var _evancz$elm_markdown$Markdown$toHtmlWith = _evancz$elm_markdown$Native_Markdown.toHtml;
var _evancz$elm_markdown$Markdown$defaultOptions = {
	githubFlavored: _elm_lang$core$Maybe$Just(
		{tables: false, breaks: false}),
	defaultHighlighting: _elm_lang$core$Maybe$Nothing,
	sanitize: false,
	smartypants: false
};
var _evancz$elm_markdown$Markdown$toHtml = F2(
	function (attrs, string) {
		return A3(_evancz$elm_markdown$Native_Markdown.toHtml, _evancz$elm_markdown$Markdown$defaultOptions, attrs, string);
	});
var _evancz$elm_markdown$Markdown$Options = F4(
	function (a, b, c, d) {
		return {githubFlavored: a, defaultHighlighting: b, sanitize: c, smartypants: d};
	});

var _evancz$url_parser$UrlParser$toKeyValuePair = function (segment) {
	var _p0 = A2(_elm_lang$core$String$split, '=', segment);
	if (((_p0.ctor === '::') && (_p0._1.ctor === '::')) && (_p0._1._1.ctor === '[]')) {
		return A3(
			_elm_lang$core$Maybe$map2,
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			_elm_lang$http$Http$decodeUri(_p0._0),
			_elm_lang$http$Http$decodeUri(_p0._1._0));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _evancz$url_parser$UrlParser$parseParams = function (queryString) {
	return _elm_lang$core$Dict$fromList(
		A2(
			_elm_lang$core$List$filterMap,
			_evancz$url_parser$UrlParser$toKeyValuePair,
			A2(
				_elm_lang$core$String$split,
				'&',
				A2(_elm_lang$core$String$dropLeft, 1, queryString))));
};
var _evancz$url_parser$UrlParser$splitUrl = function (url) {
	var _p1 = A2(_elm_lang$core$String$split, '/', url);
	if ((_p1.ctor === '::') && (_p1._0 === '')) {
		return _p1._1;
	} else {
		return _p1;
	}
};
var _evancz$url_parser$UrlParser$parseHelp = function (states) {
	parseHelp:
	while (true) {
		var _p2 = states;
		if (_p2.ctor === '[]') {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			var _p4 = _p2._0;
			var _p3 = _p4.unvisited;
			if (_p3.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p4.value);
			} else {
				if ((_p3._0 === '') && (_p3._1.ctor === '[]')) {
					return _elm_lang$core$Maybe$Just(_p4.value);
				} else {
					var _v4 = _p2._1;
					states = _v4;
					continue parseHelp;
				}
			}
		}
	}
};
var _evancz$url_parser$UrlParser$parse = F3(
	function (_p5, url, params) {
		var _p6 = _p5;
		return _evancz$url_parser$UrlParser$parseHelp(
			_p6._0(
				{
					visited: {ctor: '[]'},
					unvisited: _evancz$url_parser$UrlParser$splitUrl(url),
					params: params,
					value: _elm_lang$core$Basics$identity
				}));
	});
var _evancz$url_parser$UrlParser$parseHash = F2(
	function (parser, location) {
		return A3(
			_evancz$url_parser$UrlParser$parse,
			parser,
			A2(_elm_lang$core$String$dropLeft, 1, location.hash),
			_evancz$url_parser$UrlParser$parseParams(location.search));
	});
var _evancz$url_parser$UrlParser$parsePath = F2(
	function (parser, location) {
		return A3(
			_evancz$url_parser$UrlParser$parse,
			parser,
			location.pathname,
			_evancz$url_parser$UrlParser$parseParams(location.search));
	});
var _evancz$url_parser$UrlParser$intParamHelp = function (maybeValue) {
	var _p7 = maybeValue;
	if (_p7.ctor === 'Nothing') {
		return _elm_lang$core$Maybe$Nothing;
	} else {
		return _elm_lang$core$Result$toMaybe(
			_elm_lang$core$String$toInt(_p7._0));
	}
};
var _evancz$url_parser$UrlParser$mapHelp = F2(
	function (func, _p8) {
		var _p9 = _p8;
		return {
			visited: _p9.visited,
			unvisited: _p9.unvisited,
			params: _p9.params,
			value: func(_p9.value)
		};
	});
var _evancz$url_parser$UrlParser$State = F4(
	function (a, b, c, d) {
		return {visited: a, unvisited: b, params: c, value: d};
	});
var _evancz$url_parser$UrlParser$Parser = function (a) {
	return {ctor: 'Parser', _0: a};
};
var _evancz$url_parser$UrlParser$s = function (str) {
	return _evancz$url_parser$UrlParser$Parser(
		function (_p10) {
			var _p11 = _p10;
			var _p12 = _p11.unvisited;
			if (_p12.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				var _p13 = _p12._0;
				return _elm_lang$core$Native_Utils.eq(_p13, str) ? {
					ctor: '::',
					_0: A4(
						_evancz$url_parser$UrlParser$State,
						{ctor: '::', _0: _p13, _1: _p11.visited},
						_p12._1,
						_p11.params,
						_p11.value),
					_1: {ctor: '[]'}
				} : {ctor: '[]'};
			}
		});
};
var _evancz$url_parser$UrlParser$custom = F2(
	function (tipe, stringToSomething) {
		return _evancz$url_parser$UrlParser$Parser(
			function (_p14) {
				var _p15 = _p14;
				var _p16 = _p15.unvisited;
				if (_p16.ctor === '[]') {
					return {ctor: '[]'};
				} else {
					var _p18 = _p16._0;
					var _p17 = stringToSomething(_p18);
					if (_p17.ctor === 'Ok') {
						return {
							ctor: '::',
							_0: A4(
								_evancz$url_parser$UrlParser$State,
								{ctor: '::', _0: _p18, _1: _p15.visited},
								_p16._1,
								_p15.params,
								_p15.value(_p17._0)),
							_1: {ctor: '[]'}
						};
					} else {
						return {ctor: '[]'};
					}
				}
			});
	});
var _evancz$url_parser$UrlParser$string = A2(_evancz$url_parser$UrlParser$custom, 'STRING', _elm_lang$core$Result$Ok);
var _evancz$url_parser$UrlParser$int = A2(_evancz$url_parser$UrlParser$custom, 'NUMBER', _elm_lang$core$String$toInt);
var _evancz$url_parser$UrlParser_ops = _evancz$url_parser$UrlParser_ops || {};
_evancz$url_parser$UrlParser_ops['</>'] = F2(
	function (_p20, _p19) {
		var _p21 = _p20;
		var _p22 = _p19;
		return _evancz$url_parser$UrlParser$Parser(
			function (state) {
				return A2(
					_elm_lang$core$List$concatMap,
					_p22._0,
					_p21._0(state));
			});
	});
var _evancz$url_parser$UrlParser$map = F2(
	function (subValue, _p23) {
		var _p24 = _p23;
		return _evancz$url_parser$UrlParser$Parser(
			function (_p25) {
				var _p26 = _p25;
				return A2(
					_elm_lang$core$List$map,
					_evancz$url_parser$UrlParser$mapHelp(_p26.value),
					_p24._0(
						{visited: _p26.visited, unvisited: _p26.unvisited, params: _p26.params, value: subValue}));
			});
	});
var _evancz$url_parser$UrlParser$oneOf = function (parsers) {
	return _evancz$url_parser$UrlParser$Parser(
		function (state) {
			return A2(
				_elm_lang$core$List$concatMap,
				function (_p27) {
					var _p28 = _p27;
					return _p28._0(state);
				},
				parsers);
		});
};
var _evancz$url_parser$UrlParser$top = _evancz$url_parser$UrlParser$Parser(
	function (state) {
		return {
			ctor: '::',
			_0: state,
			_1: {ctor: '[]'}
		};
	});
var _evancz$url_parser$UrlParser_ops = _evancz$url_parser$UrlParser_ops || {};
_evancz$url_parser$UrlParser_ops['<?>'] = F2(
	function (_p30, _p29) {
		var _p31 = _p30;
		var _p32 = _p29;
		return _evancz$url_parser$UrlParser$Parser(
			function (state) {
				return A2(
					_elm_lang$core$List$concatMap,
					_p32._0,
					_p31._0(state));
			});
	});
var _evancz$url_parser$UrlParser$QueryParser = function (a) {
	return {ctor: 'QueryParser', _0: a};
};
var _evancz$url_parser$UrlParser$customParam = F2(
	function (key, func) {
		return _evancz$url_parser$UrlParser$QueryParser(
			function (_p33) {
				var _p34 = _p33;
				var _p35 = _p34.params;
				return {
					ctor: '::',
					_0: A4(
						_evancz$url_parser$UrlParser$State,
						_p34.visited,
						_p34.unvisited,
						_p35,
						_p34.value(
							func(
								A2(_elm_lang$core$Dict$get, key, _p35)))),
					_1: {ctor: '[]'}
				};
			});
	});
var _evancz$url_parser$UrlParser$stringParam = function (name) {
	return A2(_evancz$url_parser$UrlParser$customParam, name, _elm_lang$core$Basics$identity);
};
var _evancz$url_parser$UrlParser$intParam = function (name) {
	return A2(_evancz$url_parser$UrlParser$customParam, name, _evancz$url_parser$UrlParser$intParamHelp);
};

var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$emptyPayload = _elm_lang$core$Json_Encode$object(
	{ctor: '[]'});
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$maybeInt = function (maybe) {
	var _p0 = maybe;
	if (_p0.ctor === 'Just') {
		return _elm_lang$core$Json_Encode$int(_p0._0);
	} else {
		return _elm_lang$core$Json_Encode$null;
	}
};
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$messageEncoder = function (_p1) {
	var _p2 = _p1;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'event',
				_1: _elm_lang$core$Json_Encode$string(_p2.event)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'topic',
					_1: _elm_lang$core$Json_Encode$string(_p2.topic)
				},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'payload', _1: _p2.payload},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'ref',
							_1: _fbonetti$elm_phoenix_socket$Phoenix_Helpers$maybeInt(_p2.ref)
						},
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$encodeMessage = function (_p3) {
	return A2(
		_elm_lang$core$Json_Encode$encode,
		0,
		_fbonetti$elm_phoenix_socket$Phoenix_Helpers$messageEncoder(_p3));
};
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$nullOrInt = _elm_lang$core$Json_Decode$oneOf(
	{
		ctor: '::',
		_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
		_1: {
			ctor: '::',
			_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$int),
			_1: {ctor: '[]'}
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$Message = F4(
	function (a, b, c, d) {
		return {event: a, topic: b, payload: c, ref: d};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$messageDecoder = A5(
	_elm_lang$core$Json_Decode$map4,
	_fbonetti$elm_phoenix_socket$Phoenix_Helpers$Message,
	A2(_elm_lang$core$Json_Decode$field, 'event', _elm_lang$core$Json_Decode$string),
	A2(_elm_lang$core$Json_Decode$field, 'topic', _elm_lang$core$Json_Decode$string),
	A2(_elm_lang$core$Json_Decode$field, 'payload', _elm_lang$core$Json_Decode$value),
	A2(_elm_lang$core$Json_Decode$field, 'ref', _fbonetti$elm_phoenix_socket$Phoenix_Helpers$nullOrInt));

var _fbonetti$elm_phoenix_socket$Phoenix_Channel$setState = F2(
	function (state, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{state: state});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$onJoinError = F2(
	function (valueToMsg, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{
				onJoinError: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$onJoin = F2(
	function (valueToMsg, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{
				onJoin: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$onClose = F2(
	function (valueToMsg, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{
				onClose: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$onError = F2(
	function (valueToMsg, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{
				onError: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$withPayload = F2(
	function (payload, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{payload: payload});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Channel = F9(
	function (a, b, c, d, e, f, g, h, i) {
		return {name: a, payload: b, state: c, onClose: d, onError: e, onJoin: f, onJoinError: g, joinRef: h, leaveRef: i};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Leaving = {ctor: 'Leaving'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joining = {ctor: 'Joining'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joined = {ctor: 'Joined'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Errored = {ctor: 'Errored'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Closed = {ctor: 'Closed'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$init = function (name) {
	return {name: name, payload: _fbonetti$elm_phoenix_socket$Phoenix_Helpers$emptyPayload, state: _fbonetti$elm_phoenix_socket$Phoenix_Channel$Closed, onClose: _elm_lang$core$Maybe$Nothing, onError: _elm_lang$core$Maybe$Nothing, onJoin: _elm_lang$core$Maybe$Nothing, onJoinError: _elm_lang$core$Maybe$Nothing, joinRef: -1, leaveRef: -1};
};

var _fbonetti$elm_phoenix_socket$Phoenix_Push$onError = F2(
	function (valueToMsg, push) {
		return _elm_lang$core$Native_Utils.update(
			push,
			{
				onError: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Push$onOk = F2(
	function (valueToMsg, push) {
		return _elm_lang$core$Native_Utils.update(
			push,
			{
				onOk: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload = F2(
	function (payload, push) {
		return _elm_lang$core$Native_Utils.update(
			push,
			{payload: payload});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Push$Push = F5(
	function (a, b, c, d, e) {
		return {event: a, channel: b, payload: c, onOk: d, onError: e};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Push$init = F2(
	function (event, channel) {
		return A5(_fbonetti$elm_phoenix_socket$Phoenix_Push$Push, event, channel, _fbonetti$elm_phoenix_socket$Phoenix_Helpers$emptyPayload, _elm_lang$core$Maybe$Nothing, _elm_lang$core$Maybe$Nothing);
	});

var _fbonetti$elm_phoenix_socket$Phoenix_Socket$replyDecoder = A3(
	_elm_lang$core$Json_Decode$map2,
	F2(
		function (v0, v1) {
			return {ctor: '_Tuple2', _0: v0, _1: v1};
		}),
	A2(_elm_lang$core$Json_Decode$field, 'status', _elm_lang$core$Json_Decode$string),
	A2(_elm_lang$core$Json_Decode$field, 'response', _elm_lang$core$Json_Decode$value));
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$decodeMessage = function (_p0) {
	return _elm_lang$core$Result$toMaybe(
		A2(_elm_lang$core$Json_Decode$decodeString, _fbonetti$elm_phoenix_socket$Phoenix_Helpers$messageDecoder, _p0));
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$debugIfEnabled = function (socket) {
	return socket.debug ? _elm_lang$core$Debug$log('phx_message') : _elm_lang$core$Basics$identity;
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$phoenixMessages = function (socket) {
	return A2(_elm_lang$websocket$WebSocket$listen, socket.path, _fbonetti$elm_phoenix_socket$Phoenix_Socket$decodeMessage);
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$mapAll = F2(
	function (fn, internalMsg) {
		var _p1 = internalMsg;
		if (_p1.ctor === 'ExternalMsg') {
			return _p1._0;
		} else {
			return fn(internalMsg);
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$sendMessage = F2(
	function (path, message) {
		return A2(
			_elm_lang$websocket$WebSocket$send,
			path,
			_fbonetti$elm_phoenix_socket$Phoenix_Helpers$encodeMessage(message));
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$send = F4(
	function (_p2, event, channel, payload) {
		var _p3 = _p2;
		return A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Socket$sendMessage,
			_p3.path,
			A4(
				_fbonetti$elm_phoenix_socket$Phoenix_Helpers$Message,
				event,
				channel,
				payload,
				_elm_lang$core$Maybe$Just(_p3.ref)));
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$off = F3(
	function (eventName, channelName, socket) {
		return _elm_lang$core$Native_Utils.update(
			socket,
			{
				events: A2(
					_elm_lang$core$Dict$remove,
					{ctor: '_Tuple2', _0: eventName, _1: channelName},
					socket.events)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$on = F4(
	function (eventName, channelName, onReceive, socket) {
		return _elm_lang$core$Native_Utils.update(
			socket,
			{
				events: A3(
					_elm_lang$core$Dict$insert,
					{ctor: '_Tuple2', _0: eventName, _1: channelName},
					onReceive,
					socket.events)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$push = F2(
	function (push_, socket) {
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				socket,
				{
					pushes: A3(_elm_lang$core$Dict$insert, socket.ref, push_, socket.pushes),
					ref: socket.ref + 1
				}),
			_1: A4(_fbonetti$elm_phoenix_socket$Phoenix_Socket$send, socket, push_.event, push_.channel, push_.payload)
		};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$heartbeat = function (socket) {
	var push_ = A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'heartbeat', 'phoenix');
	return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, push_, socket);
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$leave = F2(
	function (channelName, socket) {
		var _p4 = A2(_elm_lang$core$Dict$get, channelName, socket.channels);
		if (_p4.ctor === 'Just') {
			var _p5 = _p4._0;
			if (_elm_lang$core$Native_Utils.eq(_p5.state, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joining) || _elm_lang$core$Native_Utils.eq(_p5.state, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joined)) {
				var channel_ = _elm_lang$core$Native_Utils.update(
					_p5,
					{state: _fbonetti$elm_phoenix_socket$Phoenix_Channel$Leaving, leaveRef: socket.ref});
				var socket_ = _elm_lang$core$Native_Utils.update(
					socket,
					{
						channels: A3(_elm_lang$core$Dict$insert, channelName, channel_, socket.channels)
					});
				var push_ = A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'phx_leave', _p5.name);
				return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, push_, socket_);
			} else {
				return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
			}
		} else {
			return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$joinChannel = F2(
	function (channel, socket) {
		var channel_ = _elm_lang$core$Native_Utils.update(
			channel,
			{state: _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joining, joinRef: socket.ref});
		var socket_ = _elm_lang$core$Native_Utils.update(
			socket,
			{
				channels: A3(_elm_lang$core$Dict$insert, channel.name, channel_, socket.channels)
			});
		var push_ = A5(_fbonetti$elm_phoenix_socket$Phoenix_Push$Push, 'phx_join', channel.name, channel.payload, channel.onJoin, channel.onError);
		return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, push_, socket_);
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$join = F2(
	function (channel, socket) {
		var _p6 = A2(_elm_lang$core$Dict$get, channel.name, socket.channels);
		if (_p6.ctor === 'Just') {
			var _p7 = _p6._0.state;
			return (_elm_lang$core$Native_Utils.eq(_p7, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joined) || _elm_lang$core$Native_Utils.eq(_p7, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joining)) ? {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none} : A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$joinChannel, channel, socket);
		} else {
			return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$joinChannel, channel, socket);
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$withoutHeartbeat = function (socket) {
	return _elm_lang$core$Native_Utils.update(
		socket,
		{withoutHeartbeat: true});
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$withHeartbeatInterval = F2(
	function (intervalSeconds, socket) {
		return _elm_lang$core$Native_Utils.update(
			socket,
			{heartbeatIntervalSeconds: intervalSeconds});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$withDebug = function (socket) {
	return _elm_lang$core$Native_Utils.update(
		socket,
		{debug: true});
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$update = F2(
	function (msg, socket) {
		var _p8 = msg;
		switch (_p8.ctor) {
			case 'ChannelErrored':
				var channels = A3(
					_elm_lang$core$Dict$update,
					_p8._0,
					_elm_lang$core$Maybe$map(
						_fbonetti$elm_phoenix_socket$Phoenix_Channel$setState(_fbonetti$elm_phoenix_socket$Phoenix_Channel$Errored)),
					socket.channels);
				var socket_ = _elm_lang$core$Native_Utils.update(
					socket,
					{channels: channels});
				return {ctor: '_Tuple2', _0: socket_, _1: _elm_lang$core$Platform_Cmd$none};
			case 'ChannelClosed':
				var _p11 = _p8._0;
				var _p9 = A2(_elm_lang$core$Dict$get, _p11, socket.channels);
				if (_p9.ctor === 'Just') {
					var _p10 = _p9._0;
					var pushes = A2(_elm_lang$core$Dict$remove, _p10.joinRef, socket.pushes);
					var channels = A3(
						_elm_lang$core$Dict$insert,
						_p11,
						A2(_fbonetti$elm_phoenix_socket$Phoenix_Channel$setState, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Closed, _p10),
						socket.channels);
					var socket_ = _elm_lang$core$Native_Utils.update(
						socket,
						{channels: channels, pushes: pushes});
					return {ctor: '_Tuple2', _0: socket_, _1: _elm_lang$core$Platform_Cmd$none};
				} else {
					return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'ChannelJoined':
				var _p14 = _p8._0;
				var _p12 = A2(_elm_lang$core$Dict$get, _p14, socket.channels);
				if (_p12.ctor === 'Just') {
					var _p13 = _p12._0;
					var pushes = A2(_elm_lang$core$Dict$remove, _p13.joinRef, socket.pushes);
					var channels = A3(
						_elm_lang$core$Dict$insert,
						_p14,
						A2(_fbonetti$elm_phoenix_socket$Phoenix_Channel$setState, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joined, _p13),
						socket.channels);
					var socket_ = _elm_lang$core$Native_Utils.update(
						socket,
						{channels: channels, pushes: pushes});
					return {ctor: '_Tuple2', _0: socket_, _1: _elm_lang$core$Platform_Cmd$none};
				} else {
					return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'Heartbeat':
				return _fbonetti$elm_phoenix_socket$Phoenix_Socket$heartbeat(socket);
			default:
				return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$init = function (path) {
	return {
		path: path,
		debug: false,
		channels: _elm_lang$core$Dict$fromList(
			{ctor: '[]'}),
		events: _elm_lang$core$Dict$fromList(
			{ctor: '[]'}),
		pushes: _elm_lang$core$Dict$fromList(
			{ctor: '[]'}),
		ref: 0,
		heartbeatIntervalSeconds: 30,
		withoutHeartbeat: false
	};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$Socket = F8(
	function (a, b, c, d, e, f, g, h) {
		return {path: a, debug: b, channels: c, events: d, pushes: e, ref: f, heartbeatIntervalSeconds: g, withoutHeartbeat: h};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$Heartbeat = function (a) {
	return {ctor: 'Heartbeat', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$heartbeatSubscription = function (socket) {
	return socket.withoutHeartbeat ? _elm_lang$core$Platform_Sub$none : A2(_elm_lang$core$Time$every, _elm_lang$core$Time$second * socket.heartbeatIntervalSeconds, _fbonetti$elm_phoenix_socket$Phoenix_Socket$Heartbeat);
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ReceiveReply = F2(
	function (a, b) {
		return {ctor: 'ReceiveReply', _0: a, _1: b};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelJoined = function (a) {
	return {ctor: 'ChannelJoined', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelClosed = function (a) {
	return {ctor: 'ChannelClosed', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelErrored = function (a) {
	return {ctor: 'ChannelErrored', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg = function (a) {
	return {ctor: 'ExternalMsg', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp = {ctor: 'NoOp'};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$handleInternalPhxReply = F2(
	function (socket, message) {
		var msg = A2(
			_elm_lang$core$Maybe$andThen,
			function (_p15) {
				var _p16 = _p15;
				return A2(
					_elm_lang$core$Maybe$andThen,
					function (ref) {
						return A2(
							_elm_lang$core$Maybe$andThen,
							function (channel) {
								return _elm_lang$core$Native_Utils.eq(_p16._0, 'ok') ? (_elm_lang$core$Native_Utils.eq(ref, channel.joinRef) ? _elm_lang$core$Maybe$Just(
									_fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelJoined(message.topic)) : (_elm_lang$core$Native_Utils.eq(ref, channel.leaveRef) ? _elm_lang$core$Maybe$Just(
									_fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelClosed(message.topic)) : _elm_lang$core$Maybe$Nothing)) : _elm_lang$core$Maybe$Nothing;
							},
							A2(_elm_lang$core$Dict$get, message.topic, socket.channels));
					},
					message.ref);
			},
			_elm_lang$core$Result$toMaybe(
				A2(_elm_lang$core$Json_Decode$decodeValue, _fbonetti$elm_phoenix_socket$Phoenix_Socket$replyDecoder, message.payload)));
		return A2(_elm_lang$core$Maybe$withDefault, _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp, msg);
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$mapInternalMsgs = F2(
	function (socket, maybeMessage) {
		var _p17 = maybeMessage;
		if (_p17.ctor === 'Just') {
			var _p19 = _p17._0;
			var message = socket.debug ? A2(_elm_lang$core$Debug$log, 'Phoenix message', _p19) : _p19;
			var _p18 = message.event;
			switch (_p18) {
				case 'phx_reply':
					return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$handleInternalPhxReply, socket, message);
				case 'phx_error':
					return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelErrored(message.topic);
				case 'phx_close':
					return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelClosed(message.topic);
				default:
					return _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp;
			}
		} else {
			return _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp;
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$internalMsgs = function (socket) {
	return A2(
		_elm_lang$core$Platform_Sub$map,
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$mapInternalMsgs(socket),
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$phoenixMessages(socket));
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$handlePhxReply = F2(
	function (socket, message) {
		var msg = A2(
			_elm_lang$core$Maybe$andThen,
			function (_p20) {
				var _p21 = _p20;
				var _p25 = _p21._1;
				return A2(
					_elm_lang$core$Maybe$andThen,
					function (ref) {
						return A2(
							_elm_lang$core$Maybe$andThen,
							function (push) {
								var _p22 = _p21._0;
								switch (_p22) {
									case 'ok':
										return A2(
											_elm_lang$core$Maybe$map,
											function (f) {
												return function (_p23) {
													return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
														f(_p23));
												}(_p25);
											},
											push.onOk);
									case 'error':
										return A2(
											_elm_lang$core$Maybe$map,
											function (f) {
												return function (_p24) {
													return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
														f(_p24));
												}(_p25);
											},
											push.onError);
									default:
										return _elm_lang$core$Maybe$Nothing;
								}
							},
							A2(_elm_lang$core$Dict$get, ref, socket.pushes));
					},
					message.ref);
			},
			_elm_lang$core$Result$toMaybe(
				A2(_elm_lang$core$Json_Decode$decodeValue, _fbonetti$elm_phoenix_socket$Phoenix_Socket$replyDecoder, message.payload)));
		return A2(_elm_lang$core$Maybe$withDefault, _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp, msg);
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$handleEvent = F2(
	function (socket, message) {
		var _p26 = A2(
			_elm_lang$core$Dict$get,
			{ctor: '_Tuple2', _0: message.event, _1: message.topic},
			socket.events);
		if (_p26.ctor === 'Just') {
			return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
				_p26._0(message.payload));
		} else {
			return _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp;
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$mapExternalMsgs = F2(
	function (socket, maybeMessage) {
		var _p27 = maybeMessage;
		if (_p27.ctor === 'Just') {
			var _p31 = _p27._0;
			var _p28 = _p31.event;
			switch (_p28) {
				case 'phx_reply':
					return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$handlePhxReply, socket, _p31);
				case 'phx_error':
					var channel = A2(_elm_lang$core$Dict$get, _p31.topic, socket.channels);
					var onError = A2(
						_elm_lang$core$Maybe$andThen,
						function (_) {
							return _.onError;
						},
						channel);
					var msg = A2(
						_elm_lang$core$Maybe$map,
						function (f) {
							return function (_p29) {
								return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
									f(_p29));
							}(_p31.payload);
						},
						onError);
					return A2(_elm_lang$core$Maybe$withDefault, _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp, msg);
				case 'phx_close':
					var channel = A2(_elm_lang$core$Dict$get, _p31.topic, socket.channels);
					var onClose = A2(
						_elm_lang$core$Maybe$andThen,
						function (_) {
							return _.onClose;
						},
						channel);
					var msg = A2(
						_elm_lang$core$Maybe$map,
						function (f) {
							return function (_p30) {
								return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
									f(_p30));
							}(_p31.payload);
						},
						onClose);
					return A2(_elm_lang$core$Maybe$withDefault, _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp, msg);
				default:
					return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$handleEvent, socket, _p31);
			}
		} else {
			return _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp;
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$externalMsgs = function (socket) {
	return A2(
		_elm_lang$core$Platform_Sub$map,
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$mapExternalMsgs(socket),
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$phoenixMessages(socket));
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$listen = F2(
	function (socket, fn) {
		return function (_p32) {
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_fbonetti$elm_phoenix_socket$Phoenix_Socket$mapAll(fn),
				_elm_lang$core$Platform_Sub$batch(_p32));
		}(
			{
				ctor: '::',
				_0: _fbonetti$elm_phoenix_socket$Phoenix_Socket$internalMsgs(socket),
				_1: {
					ctor: '::',
					_0: _fbonetti$elm_phoenix_socket$Phoenix_Socket$externalMsgs(socket),
					_1: {
						ctor: '::',
						_0: _fbonetti$elm_phoenix_socket$Phoenix_Socket$heartbeatSubscription(socket),
						_1: {ctor: '[]'}
					}
				}
			});
	});

var _gdotdesign$elm_dom$Native_DOM = function() {
  var task = _elm_lang$core$Native_Scheduler.nativeBinding
  var succeed = _elm_lang$core$Native_Scheduler.succeed
  var fail = _elm_lang$core$Native_Scheduler.fail
  var tuple0 = _elm_lang$core$Native_Utils.Tuple0

  var err = _elm_lang$core$Result$Err
  var ok = _elm_lang$core$Result$Ok

  var withElement = function(selector, method) {
    try {
      var element = document.querySelector(selector)
    } catch (error) {
      throw { ctor: "InvalidSelector", _0: selector }
    }
    if (!element) { throw { ctor: "ElementNotFound", _0: selector } }
    return method(element)
  }

  /* Get the dimensions object for an element using getBoundingClientRect. */
  var getDimensionsObject = function(selector){
    return withElement(selector, function(element){
      var rect = element.getBoundingClientRect()

      return {
        bottom: rect.bottom,
        height: rect.height,
        width: rect.width,
        right: rect.right,
        left: rect.left,
        top: rect.top
      }
    })
  }

  var async = function(method) {
    return function(){
      var args = Array.prototype.slice.call(arguments)

      return task(function(callback){
        try {
          callback(succeed(method.apply({}, args)))
        } catch (error) {
          callback(fail(error))
        }
      })
    }
  }

  var sync = function(method) {
    return function() {
      var args = Array.prototype.slice.call(arguments)

      try {
        return ok(method.apply({}, args))
      } catch (error) {
        return err(error)
      }
    }
  }

  /* ---------------------------------------------------------------------- */

  /* Runs the given message on the next animation frame. */
  var nextTick = function(){
    return task(function(callback){
      requestAnimationFrame(function(){
        callback(succeed(tuple0))
      })
    })
  }

  /* Tests if the given coordinates are over the given selector */
  var isOver = function(selector, position){
    var element = document.elementFromPoint(
      position.left - window.pageXOffset,
      position.top - window.pageYOffset
    )
    if (!element) { return err({ ctor: "ElementNotFound", _0: selector }) }
    try {
      return ok(element.matches(selector + "," + selector + " *"))
    } catch (error) {
      return err({ ctor: "InvalidSelector", _0: selector })
    }
  }

  var hasFocusedElement = function(){
    return task(function(callback){
      callback(!!document.querySelector('*:focus'))
    })
  }

  var hasFocusedElementSync = function(){
    return !!document.querySelector('*:focus')
  }

  var focus = function(selector){
    return withElement(selector, function(element){
      element.focus()
      return tuple0
    })
  }

  var blur = function(selector){
    return withElement(selector, function(element){
      element.blur()
      return tuple0
    })
  }

  var select = function(selector) {
    return withElement(selector, function(element){
      if(!element.select){
        throw { ctor: "TextNotSelectable", _0: selector }
      }
      element.select()
      return tuple0
    })
  }

  var setScrollLeft = function(position, selector){
    return withElement(selector, function(element){
      element.scrollLeft = position
      return tuple0
    })
  }

  var setScrollTop = function(position, selector){
    return withElement(selector, function(element){
      element.scrollTop = position
      return tuple0
    })
  }

  var scrollIntoView = function(selector) {
    return withElement(selector, function(element){
      element.scrollIntoView()
      return tuple0
    })
  }

  var getScrollLeft = function(selector){
    return withElement(selector, function(element){
      return element.scrollLeft
    })
  }

  var getScrollTop = function(selector){
    return withElement(selector, function(element){
      return element.scrollTop
    })
  }

  var setValue = function(value, selector){
    return withElement(selector, function(element){
      element.value = value
      return tuple0
    })
  }

  var getValue = function(selector) {
    return withElement(selector, function(element){
      return element.value || ""
    })
  }

  var windowScrollTop = function(){
    return window.pageYOffset
  }

  var windowScrollLeft = function(){
    return window.pageXOffset
  }

  var windowWidth = function(){
    return window.innerWidth
  }

  var windowHeight = function(){
    return window.innerHeight
  }

  var contains = function(selector){
    try {
      return !!document.querySelector(selector)
    } catch (error) {
      return false
    }
  }

  return {
    hasFocusedElementSync: hasFocusedElementSync,
    hasFocusedElement: hasFocusedElement,

    getDimensionsSync: sync(getDimensionsObject),
    getDimensions: async(getDimensionsObject),

    scrollIntoViewSync: sync(scrollIntoView),
    scrollIntoView: async(scrollIntoView),

    setScrollLeftSync: F2(sync(setScrollLeft)),
    setScrollLeft: F2(async(setScrollLeft)),

    setScrollTopSync: F2(sync(setScrollTop)),
    setScrollTop: F2(async(setScrollTop)),

    getScrollLeftSync: sync(getScrollLeft),
    getScrollLeft: async(getScrollLeft),

    getScrollTopSync: sync(getScrollTop),
    getScrollTop: async(getScrollTop),

    selectSync: sync(select),
    select: async(select),

    setValueSync: F2(sync(setValue)),
    setValue: F2(async(setValue)),

    getValueSync: sync(getValue),
    getValue: async(getValue),

    focusSync: sync(focus),
    focus: async(focus),

    blurSync: sync(blur),
    blur: async(blur),

    isOver: F2(isOver),
    nextTick: nextTick,
    contains: contains,

    windowScrollLeft: windowScrollLeft,
    windowScrollTop: windowScrollTop,
    windowHeight: windowHeight,
    windowWidth: windowWidth,
  }
}()

var _gdotdesign$elm_dom$DOM$getValueSync = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.getValueSync(selector);
};
var _gdotdesign$elm_dom$DOM$getValue = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.getValue(selector);
};
var _gdotdesign$elm_dom$DOM$setValueSync = F2(
	function (value, selector) {
		return A2(_gdotdesign$elm_dom$Native_DOM.setValueSync, value, selector);
	});
var _gdotdesign$elm_dom$DOM$setValue = F2(
	function (value, selector) {
		return A2(_gdotdesign$elm_dom$Native_DOM.setValue, value, selector);
	});
var _gdotdesign$elm_dom$DOM$getScrollTopSync = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.getScrollTopSync(selector);
};
var _gdotdesign$elm_dom$DOM$getScrollTop = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.getScrollTop(selector);
};
var _gdotdesign$elm_dom$DOM$getScrollLeftSync = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.getScrollLeftSync(selector);
};
var _gdotdesign$elm_dom$DOM$getScrollLeft = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.getScrollLeft(selector);
};
var _gdotdesign$elm_dom$DOM$scrollIntoViewSync = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.scrollIntoViewSync(selector);
};
var _gdotdesign$elm_dom$DOM$scrollIntoView = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.scrollIntoView(selector);
};
var _gdotdesign$elm_dom$DOM$setScrollTopSync = F2(
	function (to, selector) {
		return A2(_gdotdesign$elm_dom$Native_DOM.setScrollTopSync, to, selector);
	});
var _gdotdesign$elm_dom$DOM$setScrollTop = F2(
	function (to, selector) {
		return A2(_gdotdesign$elm_dom$Native_DOM.setScrollTop, to, selector);
	});
var _gdotdesign$elm_dom$DOM$setScrollLeftSync = F2(
	function (to, selector) {
		return A2(_gdotdesign$elm_dom$Native_DOM.setScrollLeftSync, to, selector);
	});
var _gdotdesign$elm_dom$DOM$setScrollLeft = F2(
	function (to, selector) {
		return A2(_gdotdesign$elm_dom$Native_DOM.setScrollLeft, to, selector);
	});
var _gdotdesign$elm_dom$DOM$getDimensionsSync = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.getDimensionsSync(selector);
};
var _gdotdesign$elm_dom$DOM$getDimensions = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.getDimensions(selector);
};
var _gdotdesign$elm_dom$DOM$selectSync = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.selectSync(selector);
};
var _gdotdesign$elm_dom$DOM$select = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.select(selector);
};
var _gdotdesign$elm_dom$DOM$hasFocusedElementSync = function (_p0) {
	return _gdotdesign$elm_dom$Native_DOM.hasFocusedElementSync(
		{ctor: '_Tuple0'});
};
var _gdotdesign$elm_dom$DOM$hasFocusedElement = _gdotdesign$elm_dom$Native_DOM.hasFocusedElement(
	{ctor: '_Tuple0'});
var _gdotdesign$elm_dom$DOM$blurSync = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.blurSync(selector);
};
var _gdotdesign$elm_dom$DOM$blur = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.blur(selector);
};
var _gdotdesign$elm_dom$DOM$focusSync = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.focusSync(selector);
};
var _gdotdesign$elm_dom$DOM$focus = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.focus(selector);
};
var _gdotdesign$elm_dom$DOM$isOver = F2(
	function (selector, position) {
		return A2(_gdotdesign$elm_dom$Native_DOM.isOver, selector, position);
	});
var _gdotdesign$elm_dom$DOM$contains = function (selector) {
	return _gdotdesign$elm_dom$Native_DOM.contains(selector);
};
var _gdotdesign$elm_dom$DOM$idSelector = function (value) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		'[id=\'',
		A2(_elm_lang$core$Basics_ops['++'], value, '\']'));
};
var _gdotdesign$elm_dom$DOM$Position = F2(
	function (a, b) {
		return {left: a, top: b};
	});
var _gdotdesign$elm_dom$DOM$Dimensions = F6(
	function (a, b, c, d, e, f) {
		return {height: a, bottom: b, width: c, right: d, left: e, top: f};
	});
var _gdotdesign$elm_dom$DOM$TextNotSelectable = function (a) {
	return {ctor: 'TextNotSelectable', _0: a};
};
var _gdotdesign$elm_dom$DOM$InvalidSelector = function (a) {
	return {ctor: 'InvalidSelector', _0: a};
};
var _gdotdesign$elm_dom$DOM$ElementNotFound = function (a) {
	return {ctor: 'ElementNotFound', _0: a};
};

var _gdotdesign$elm_dom$DOM_Window$height = function (_p0) {
	return _gdotdesign$elm_dom$Native_DOM.windowHeight(
		{ctor: '_Tuple0'});
};
var _gdotdesign$elm_dom$DOM_Window$width = function (_p1) {
	return _gdotdesign$elm_dom$Native_DOM.windowWidth(
		{ctor: '_Tuple0'});
};
var _gdotdesign$elm_dom$DOM_Window$scrollLeft = function (_p2) {
	return _gdotdesign$elm_dom$Native_DOM.windowScrollLeft(
		{ctor: '_Tuple0'});
};
var _gdotdesign$elm_dom$DOM_Window$scrollTop = function (_p3) {
	return _gdotdesign$elm_dom$Native_DOM.windowScrollTop(
		{ctor: '_Tuple0'});
};

var _gdotdesign$elm_ui$Native_Number = function() {

  /* Formats a number using fixed-point notation */
  function toFixed(value, decimals) {
    return value.toFixed(decimals)
  }

  /* Return remainder */
  function rem(a, b) {
    return a % b
  }

  /* Interface */
  return {
    toFixed: F2(toFixed),
    rem: F2(rem),
  }
}()

var _gdotdesign$elm_ui$Ext_Number$roundTo = F2(
	function (precision, number) {
		var magnitude = _elm_lang$core$Basics$toFloat(10 * precision);
		return _elm_lang$core$Basics$toFloat(
			_elm_lang$core$Basics$round(number * magnitude)) / magnitude;
	});
var _gdotdesign$elm_ui$Ext_Number$remFloat = F2(
	function (a, b) {
		return A2(_gdotdesign$elm_ui$Native_Number.rem, a, b);
	});
var _gdotdesign$elm_ui$Ext_Number$toFixed = F2(
	function (precision, number) {
		return A2(_gdotdesign$elm_ui$Native_Number.toFixed, number, precision);
	});

var _gdotdesign$elm_ui$Native_DateTime = function() {
  /* Function to return the current day. */
  function now(){
    return new Date()
  }

  /* Create a date from the given arguments. */
  function create(year, month, day){
    return new Date(year, month - 1 , day)
  }

  /* Get the days in the month of the given date. */
  function daysInMonth(date) {
    return new Date(date.getYear(),date.getMonth() + 1,0).getDate()
  }

  /* Get the month of the given date. */
  function month(date){
    return date.getMonth() + 1
  }

  /* Interface. */
  return {
    daysInMonth: daysInMonth,
    create: F3(create),
    month: month,
    now: now
  }
}()

var _gdotdesign$elm_ui$Ext_Date$ago = F2(
	function (date, other) {
		var format = F2(
			function (number, affix) {
				var prefix = _elm_lang$core$Native_Utils.eq(affix, 'hour') ? 'an' : 'a';
				return (_elm_lang$core$Native_Utils.cmp(number, 2) < 0) ? A2(
					_elm_lang$core$Basics_ops['++'],
					prefix,
					A2(_elm_lang$core$Basics_ops['++'], ' ', affix)) : A2(
					_elm_lang$core$Basics_ops['++'],
					_elm_lang$core$Basics$toString(number),
					A2(
						_elm_lang$core$Basics_ops['++'],
						' ',
						A2(_elm_lang$core$Basics_ops['++'], affix, 's')));
			});
		var seconds = (_elm_lang$core$Date$toTime(other) - _elm_lang$core$Date$toTime(date)) / 1000;
		var year = _elm_lang$core$Basics$floor(seconds / 31536000);
		var month = _elm_lang$core$Basics$floor(seconds / 2592000);
		var day = _elm_lang$core$Basics$floor(seconds / 86400);
		var hour = _elm_lang$core$Basics$floor(seconds / 3600);
		var minute = _elm_lang$core$Basics$floor(seconds / 60);
		var value = (_elm_lang$core$Native_Utils.cmp(year, 1) > -1) ? A2(format, year, 'year') : ((_elm_lang$core$Native_Utils.cmp(month, 1) > -1) ? A2(format, month, 'month') : ((_elm_lang$core$Native_Utils.cmp(day, 1) > -1) ? A2(format, day, 'day') : ((_elm_lang$core$Native_Utils.cmp(hour, 1) > -1) ? A2(format, hour, 'hour') : ((_elm_lang$core$Native_Utils.cmp(minute, 1) > -1) ? A2(format, minute, 'minute') : A2(
			format,
			_elm_lang$core$Basics$floor(seconds),
			'second')))));
		return (_elm_lang$core$Native_Utils.cmp(minute, 0) > 0) ? ((_elm_lang$core$Native_Utils.cmp(seconds, 0) > 0) ? A2(_elm_lang$core$Basics_ops['++'], value, ' ago') : A2(_elm_lang$core$Basics_ops['++'], 'in ', value)) : 'just now';
	});
var _gdotdesign$elm_ui$Ext_Date$daysInMonth = function (date) {
	return _gdotdesign$elm_ui$Native_DateTime.daysInMonth(date);
};
var _gdotdesign$elm_ui$Ext_Date$month = function (date) {
	return _gdotdesign$elm_ui$Native_DateTime.month(date);
};
var _gdotdesign$elm_ui$Ext_Date$isSameMonth = F2(
	function (date, other) {
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$Date$year(date),
			_elm_lang$core$Date$year(other)) && _elm_lang$core$Native_Utils.eq(
			_gdotdesign$elm_ui$Ext_Date$month(date),
			_gdotdesign$elm_ui$Ext_Date$month(other));
	});
var _gdotdesign$elm_ui$Ext_Date$isSameDate = F2(
	function (date, other) {
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$Date$year(date),
			_elm_lang$core$Date$year(other)) && (_elm_lang$core$Native_Utils.eq(
			_elm_lang$core$Date$day(date),
			_elm_lang$core$Date$day(other)) && _elm_lang$core$Native_Utils.eq(
			_gdotdesign$elm_ui$Ext_Date$month(date),
			_gdotdesign$elm_ui$Ext_Date$month(other)));
	});
var _gdotdesign$elm_ui$Ext_Date$createDate = F3(
	function (year, month, day) {
		return A3(_gdotdesign$elm_ui$Native_DateTime.create, year, month, day);
	});
var _gdotdesign$elm_ui$Ext_Date$datesInMonth = function (date) {
	var create = function (day) {
		return A3(
			_gdotdesign$elm_ui$Ext_Date$createDate,
			_elm_lang$core$Date$year(date),
			_gdotdesign$elm_ui$Ext_Date$month(date),
			day + 1);
	};
	return _elm_lang$core$Array$toList(
		A2(
			_elm_lang$core$Array$initialize,
			_gdotdesign$elm_ui$Ext_Date$daysInMonth(date),
			create));
};
var _gdotdesign$elm_ui$Ext_Date$previousDay = function (date) {
	return A3(
		_gdotdesign$elm_ui$Ext_Date$createDate,
		_elm_lang$core$Date$year(date),
		_gdotdesign$elm_ui$Ext_Date$month(date),
		_elm_lang$core$Date$day(date) - 1);
};
var _gdotdesign$elm_ui$Ext_Date$nextDay = function (date) {
	return A3(
		_gdotdesign$elm_ui$Ext_Date$createDate,
		_elm_lang$core$Date$year(date),
		_gdotdesign$elm_ui$Ext_Date$month(date),
		_elm_lang$core$Date$day(date) + 1);
};
var _gdotdesign$elm_ui$Ext_Date$begginingOfMonth = function (date) {
	return A3(
		_gdotdesign$elm_ui$Ext_Date$createDate,
		_elm_lang$core$Date$year(date),
		_gdotdesign$elm_ui$Ext_Date$month(date),
		1);
};
var _gdotdesign$elm_ui$Ext_Date$nextMonth = function (date) {
	return _gdotdesign$elm_ui$Ext_Date$begginingOfMonth(
		A3(
			_gdotdesign$elm_ui$Ext_Date$createDate,
			_elm_lang$core$Date$year(date),
			_gdotdesign$elm_ui$Ext_Date$month(date) + 1,
			_elm_lang$core$Date$day(date)));
};
var _gdotdesign$elm_ui$Ext_Date$previousMonth = function (date) {
	return _gdotdesign$elm_ui$Ext_Date$begginingOfMonth(
		A3(
			_gdotdesign$elm_ui$Ext_Date$createDate,
			_elm_lang$core$Date$year(date),
			_gdotdesign$elm_ui$Ext_Date$month(date),
			0));
};
var _gdotdesign$elm_ui$Ext_Date$endOfMonth = function (date) {
	return A3(
		_gdotdesign$elm_ui$Ext_Date$createDate,
		_elm_lang$core$Date$year(date),
		_gdotdesign$elm_ui$Ext_Date$month(date) + 1,
		0);
};
var _gdotdesign$elm_ui$Ext_Date$now = function (_p0) {
	return _gdotdesign$elm_ui$Native_DateTime.now(_elm_lang$core$Maybe$Nothing);
};
var _gdotdesign$elm_ui$Ext_Date$nowTime = function (_p1) {
	return _elm_lang$core$Date$toTime(
		_gdotdesign$elm_ui$Ext_Date$now(
			{ctor: '_Tuple0'}));
};

var _gdotdesign$elm_ui$Html_Events_Options$stopOptions = {stopPropagation: true, preventDefault: true};
var _gdotdesign$elm_ui$Html_Events_Options$stopPropagationOptions = {stopPropagation: true, preventDefault: false};
var _gdotdesign$elm_ui$Html_Events_Options$preventDefaultOptions = {stopPropagation: false, preventDefault: true};

var _gdotdesign$elm_ui$Html_Events_Extra$keysDecoder = function (mappings) {
	var dict = _elm_lang$core$Dict$fromList(mappings);
	var decode = function (value) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			_elm_lang$core$Json_Decode$fail('Key pressed not was no in mappings!'),
			A2(
				_elm_lang$core$Maybe$map,
				_elm_lang$core$Json_Decode$succeed,
				A2(_elm_lang$core$Dict$get, value, dict)));
	};
	return A2(_elm_lang$core$Json_Decode$andThen, decode, _elm_lang$html$Html_Events$keyCode);
};
var _gdotdesign$elm_ui$Html_Events_Extra$onError = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'error',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _gdotdesign$elm_ui$Html_Events_Extra$onLoad = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'load',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _gdotdesign$elm_ui$Html_Events_Extra$onKeys = F2(
	function (shouldPreventDefault, mappings) {
		var options = shouldPreventDefault ? _gdotdesign$elm_ui$Html_Events_Options$preventDefaultOptions : _elm_lang$html$Html_Events$defaultOptions;
		return A3(
			_elm_lang$html$Html_Events$onWithOptions,
			'keydown',
			options,
			_gdotdesign$elm_ui$Html_Events_Extra$keysDecoder(mappings));
	});
var _gdotdesign$elm_ui$Html_Events_Extra$onTransitionEnd = function (decoder) {
	return A2(_elm_lang$html$Html_Events$on, 'transitionend', decoder);
};
var _gdotdesign$elm_ui$Html_Events_Extra$onScroll = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'scroll',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _gdotdesign$elm_ui$Html_Events_Extra$onPreventDefault = F2(
	function (event, msg) {
		return A3(
			_elm_lang$html$Html_Events$onWithOptions,
			event,
			_gdotdesign$elm_ui$Html_Events_Options$preventDefaultOptions,
			_elm_lang$core$Json_Decode$succeed(msg));
	});
var _gdotdesign$elm_ui$Html_Events_Extra$onEnterPreventDefault = function (action) {
	var mappings = {
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 13, _1: action},
		_1: {ctor: '[]'}
	};
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'keydown',
		_gdotdesign$elm_ui$Html_Events_Options$preventDefaultOptions,
		_gdotdesign$elm_ui$Html_Events_Extra$keysDecoder(mappings));
};
var _gdotdesign$elm_ui$Html_Events_Extra$onEnter = F2(
	function (control, msg) {
		var decoder2 = function (pressed) {
			return pressed ? _gdotdesign$elm_ui$Html_Events_Extra$keysDecoder(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 13, _1: msg},
					_1: {ctor: '[]'}
				}) : _elm_lang$core$Json_Decode$fail('Control wasn\'t pressed!');
		};
		var decoder = control ? A2(
			_elm_lang$core$Json_Decode$andThen,
			decoder2,
			A2(_elm_lang$core$Json_Decode$field, 'ctrlKey', _elm_lang$core$Json_Decode$bool)) : decoder2(true);
		return A3(_elm_lang$html$Html_Events$onWithOptions, 'keyup', _gdotdesign$elm_ui$Html_Events_Options$stopOptions, decoder);
	});
var _gdotdesign$elm_ui$Html_Events_Extra$onFocusOut = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'focusout',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _gdotdesign$elm_ui$Html_Events_Extra$onWheel = F2(
	function (decoder, action) {
		return A2(
			_elm_lang$html$Html_Events$on,
			'wheel',
			A2(_elm_lang$core$Json_Decode$map, action, decoder));
	});
var _gdotdesign$elm_ui$Html_Events_Extra$decodeDelta = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'deltaY',
		_1: {ctor: '[]'}
	},
	_elm_lang$core$Json_Decode$float);
var _gdotdesign$elm_ui$Html_Events_Extra$unobtrusiveClick = function (msg) {
	var result = function (_p0) {
		var _p1 = _p0;
		return (_p1._0 || _elm_lang$core$Native_Utils.eq(_p1._1, 1)) ? _elm_lang$core$Json_Decode$fail('Control key or middle mouse button is pressed!') : _elm_lang$core$Json_Decode$succeed(msg);
	};
	var decoder = A2(
		_elm_lang$core$Json_Decode$andThen,
		result,
		A3(
			_elm_lang$core$Json_Decode$map2,
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			A2(_elm_lang$core$Json_Decode$field, 'ctrlKey', _elm_lang$core$Json_Decode$bool),
			A2(_elm_lang$core$Json_Decode$field, 'button', _elm_lang$core$Json_Decode$int)));
	return A3(_elm_lang$html$Html_Events$onWithOptions, 'click', _gdotdesign$elm_ui$Html_Events_Options$stopOptions, decoder);
};

//download.js v4.1, by dandavis; 2008-2015. [CCBY2] see http://danml.com/download.html for tests/usage
window.download = function(data, strFileName, strMimeType) {
  var self = window, // this script is only for browsers anyway...
    defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
    mimeType = strMimeType || defaultMime,
    payload = data,
    url = !strFileName && !strMimeType && payload,
    anchor = document.createElement("a"),
    toString = function(a){return String(a);},
    myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
    fileName = strFileName || "download",
    blob,
    reader;
    myBlob= myBlob.call ? myBlob.bind(self) : Blob ;

  if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
    payload=[payload, mimeType];
    mimeType=payload[0];
    payload=payload[1];
  }


  if(url && url.length< 2048){ // if no filename and no mime, assume a url was passed as the only argument
    fileName = url.split("/").pop().split("?")[0];
    anchor.href = url; // assign href prop to temp anchor
      if(anchor.href.indexOf(url) !== -1){ // if the browser determines that it's a potentially valid url path:
          var ajax=new XMLHttpRequest();
          ajax.open( "GET", url, true);
          ajax.responseType = 'blob';
          ajax.onload= function(e){
        download(e.target.response, fileName, defaultMime);
      };
          setTimeout(function(){ ajax.send();}, 0); // allows setting custom ajax headers using the return:
        return ajax;
    } // end if valid url?
  } // end if url?


  //go ahead and download dataURLs right away
  if(/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)){

    if(payload.length > (1024*1024*1.999) && myBlob !== toString ){
      payload=dataUrlToBlob(payload);
      mimeType=payload.type || defaultMime;
    }else{
      return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
        navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
        saver(payload) ; // everyone else can save dataURLs un-processed
    }

  }//end if dataURL passed?

  blob = payload instanceof myBlob ?
    payload :
    new myBlob([payload], {type: mimeType}) ;


  function dataUrlToBlob(strUrl) {
    var parts= strUrl.split(/[:;,]/),
    type= parts[1],
    decoder= parts[2] == "base64" ? atob : decodeURIComponent,
    binData= decoder( parts.pop() ),
    mx= binData.length,
    i= 0,
    uiArr= new Uint8Array(mx);

    for(i;i<mx;++i) uiArr[i]= binData.charCodeAt(i);

    return new myBlob([uiArr], {type: type});
   }

  function saver(url, winMode){

    if ('download' in anchor) { //html5 A[download]
      anchor.href = url;
      anchor.setAttribute("download", fileName);
      anchor.className = "download-js-link";
      anchor.innerHTML = "downloading...";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      setTimeout(function() {
        anchor.click();
        document.body.removeChild(anchor);
        if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(anchor.href);}, 250 );}
      }, 66);
      return true;
    }

    // handle non-a[download] safari as best we can:
    if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
      url=url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
      if(!window.open(url)){ // popup blocked, offer direct download:
        if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
      }
      return true;
    }

    //do iframe dataURL download (old ch+FF):
    var f = document.createElement("iframe");
    document.body.appendChild(f);

    if(!winMode){ // force a mime that will download:
      url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
    }
    f.src=url;
    setTimeout(function(){ document.body.removeChild(f); }, 333);

  }//end saver




  if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
    return navigator.msSaveBlob(blob, fileName);
  }

  if(self.URL){ // simple fast and modern way using Blob and URL:
    saver(self.URL.createObjectURL(blob), true);
  }else{
    // handle non-Blob()+non-URL browsers:
    if(typeof blob === "string" || blob.constructor===toString ){
      try{
        return saver( "data:" +  mimeType   + ";base64,"  +  self.btoa(blob)  );
      }catch(y){
        return saver( "data:" +  mimeType   + "," + encodeURIComponent(blob)  );
      }
    }

    // Blob but not URL support:
    reader=new FileReader();
    reader.onload=function(e){
      saver(this.result);
    };
    reader.readAsDataURL(blob);
  }
  return true;
}

var _gdotdesign$elm_ui$Native_FileManager = function() {
  var isChromeApp = window.chrome && window.chrome.fileSystem


  function createInput(){
    var input = document.createElement('input')

    input.style.width = '1px'
    input.style.height = '1px'
    input.style.position = 'absolute'
    input.style.left = '-1px'
    input.style.top = '-1px'
    input.type = 'file'
    input.callback = null

    document.body.appendChild(input)

    return input;
  }


  function createFile(file) {
    return {
      name: file.name,
      size: file.size,
      mimeType: file.type,
      data: file
    }
  }

  function reader(callback) {
    var reader = new FileReader();
    reader.addEventListener('load', function(event){
      callback(_elm_lang$core$Native_Scheduler.succeed(event.target.result))
    })
    return reader
  }

  function readAsString(file) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback){
      reader(callback).readAsText(file.data)
    })
  }

  function readAsDataURL(file) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback){
      reader(callback).readAsDataURL(file.data)
    })
  }

  function toFormData(file) {
    return file.data
  }

  function downloadFunc(name,mimeType,data){
    if(isChromeApp){
      return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback){
        chrome.fileSystem.chooseEntry({type: 'saveFile',
                                       suggestedName: name}, function(fileEntry){
          blob = new Blob([data], {type: "text/plain"})
          fileEntry.createWriter(function(writer) {
            writer.onwriteend = function() {
              if (writer.length === 0) {
                writer.write(blob)
              } else {
                callback(_elm_lang$core$Native_Scheduler.succeed(""))
              }
            }
            writer.truncate(0)
          })
        })
      })
    } else {
      download(data,name,mimeType)
      return _elm_lang$core$Native_Scheduler.succeed("")
    }
  }

  var Json = _elm_lang$core$Native_Json
  var valueDecoder = Json.decodePrimitive("value")

  function openMultipleDecoder(accept){
    return Json.andThen(function(_){
      var input = createInput()
      input.accept = accept
      input.multiple = false
      input.click()
      var task = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback){
        input.addEventListener('change', function(){
          var filesArray = Array.prototype.slice.call(input.files)
          var filesObjects = filesArray.map(function(file) { return createFile(file) })
          var files = _elm_lang$core$Native_List.fromArray(filesObjects)
          callback(_elm_lang$core$Native_Scheduler.succeed(files))
        })
      })
      return Json.succeed(task)
    })(valueDecoder)
  }

  function openSingleDecoder(accept){
    return Json.andThen(function(_){
      var input = createInput()
      input.accept = accept
      input.click()
      var task = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback){
        input.addEventListener('change', function(){
          callback(_elm_lang$core$Native_Scheduler.succeed(createFile(input.files[0])))
        })
      })
      return Json.succeed(task)
    })(valueDecoder)
  }

  return {
    readAsDataURL: readAsDataURL,
    readAsString: readAsString,
    download: F3(downloadFunc),
    openMultipleDecoder: openMultipleDecoder,
    openSingleDecoder: openSingleDecoder,
    identity: function(value){ return value },
    identitiyTag: F2(function(tagger, value){ return tagger(value) }),
    toFormData: toFormData,
  }
}()

var _gdotdesign$elm_ui$Native_Styles = function() {
  var currentStyles = {}

  var setupObserver = function () {
    if(window.MutationObserver) {
      new MutationObserver(function (mutations) {
        patchStyles()
      }).observe(document.body, { childList: true, subtree: true });
    } else {
      var patch = function(){
        patchStyles()
        if(document.querySelector('[class^=container-]')) { return }
        requestAnimationFrame(patch)
      }
      requestAnimationFrame(patch)
    }
  }

  if (document.body) {
    setupObserver()
  } else {
    document.addEventListener('DOMContentLoaded', setupObserver)
  }

  function patchStyles(){
    var currentNode
    var tags = {}
    var iterator =
      document
        .createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT)

    var nextStyles = {}

    while(currentNode = iterator.nextNode()) {
      if (!currentNode.__styles) { continue }
      if (nextStyles[currentNode.__styles.id]) { continue }
      nextStyles[currentNode.__styles.id] = currentNode.__styles.value
    }

    for(var id in nextStyles) {
      if(currentStyles[id]) {
        nextStyles[id] = currentStyles[id]
        delete currentStyles[id]
      } else {
        var style = document.createElement('style')
        style.innerHTML = nextStyles[id]
        style.setAttribute('id', id)
        document.head.appendChild(style)
        nextStyles[id] = style
      }
    }

    for(var id in currentStyles) {
      currentStyles[id].remove()
    }

    currentStyles = nextStyles
  }

  /* Interface */
  return {
    patchStyles: patchStyles
  }
}()

var _gdotdesign$elm_ui$Native_Uid = function() {
  function s(n) {
    return h((Math.random() * (1<<(n<<2)))^Date.now()).slice(-n)
  }

  function h(n) {
    return (n|0).toString(16)
  }

  function uid(){
    return [
      s(4) + s(4), s(4), '4' + s(3),
      h(8|(Math.random()*4)) + s(3),
      Date.now().toString(16).slice(-10) + s(2)
    ].join('-')
  }

  /* Interface */
  return {
    uid: uid
  }
}()

var _gdotdesign$elm_ui$Ui$attributeList = function (items) {
	var attr = function (_p0) {
		var _p1 = _p0;
		return _p1._1 ? {
			ctor: '::',
			_0: A2(_elm_lang$html$Html_Attributes$attribute, _p1._0, ''),
			_1: {ctor: '[]'}
		} : {ctor: '[]'};
	};
	return _elm_lang$core$List$concat(
		A2(_elm_lang$core$List$map, attr, items));
};
var _gdotdesign$elm_ui$Ui$enabledActions = F2(
	function (model, attributes) {
		return (model.disabled || model.readonly) ? {ctor: '[]'} : attributes;
	});
var _gdotdesign$elm_ui$Ui$tabIndex = function (model) {
	return model.disabled ? {ctor: '[]'} : {
		ctor: '::',
		_0: A2(_elm_lang$html$Html_Attributes$attribute, 'tabindex', '0'),
		_1: {ctor: '[]'}
	};
};
var _gdotdesign$elm_ui$Ui$stylesheetLink = F2(
	function (path, msg) {
		return A3(
			_elm_lang$html$Html$node,
			'link',
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$rel('stylesheet'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$href(path),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Html_Events_Extra$onLoad(msg),
						_1: {ctor: '[]'}
					}
				}
			},
			{ctor: '[]'});
	});

var _gdotdesign$elm_ui$Ui_Css$renderProperties = function (properties) {
	return A2(
		_elm_lang$core$String$join,
		'\n',
		A2(
			_elm_lang$core$List$map,
			function (_p0) {
				var _p1 = _p0;
				return A2(
					_elm_lang$core$Basics_ops['++'],
					'  ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_p1._0,
						A2(
							_elm_lang$core$Basics_ops['++'],
							': ',
							A2(_elm_lang$core$Basics_ops['++'], _p1._1, ';'))));
			},
			A2(_elm_community$list_extra$List_Extra$uniqueBy, _elm_lang$core$Tuple$first, properties)));
};
var _gdotdesign$elm_ui$Ui_Css$group = function (list) {
	var fn = F2(
		function (item, dict) {
			var properties = A2(
				_elm_lang$core$Maybe$withDefault,
				{ctor: '[]'},
				A2(_elm_lang$core$Dict$get, item.name, dict));
			return A3(
				_elm_lang$core$Dict$insert,
				item.name,
				A2(_elm_lang$core$Basics_ops['++'], properties, item.properties),
				dict);
		});
	return A2(
		_elm_lang$core$List$map,
		function (_p2) {
			var _p3 = _p2;
			return {name: _p3._0, properties: _p3._1};
		},
		_elm_lang$core$Dict$toList(
			A3(_elm_lang$core$List$foldr, fn, _elm_lang$core$Dict$empty, list)));
};
var _gdotdesign$elm_ui$Ui_Css$render = function (selectors) {
	var renderSelector = function (selector) {
		return A2(
			_elm_lang$core$Basics_ops['++'],
			selector.name,
			A2(
				_elm_lang$core$Basics_ops['++'],
				' {\n',
				A2(
					_elm_lang$core$Basics_ops['++'],
					_gdotdesign$elm_ui$Ui_Css$renderProperties(selector.properties),
					'\n}')));
	};
	return A2(
		_elm_lang$core$String$join,
		'\n',
		A2(
			_elm_lang$core$List$map,
			renderSelector,
			A2(
				_elm_lang$core$List$filter,
				function (_p4) {
					return !_elm_lang$core$List$isEmpty(
						function (_) {
							return _.properties;
						}(_p4));
				},
				_gdotdesign$elm_ui$Ui_Css$group(selectors))));
};
var _gdotdesign$elm_ui$Ui_Css$getKeyFrames = function (nodes) {
	var renderBody = function (_p5) {
		var _p6 = _p5;
		var prop = function (nd) {
			var _p7 = nd;
			if (_p7.ctor === 'PropertyNode') {
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _p7._0, _1: _p7._1},
					_1: {ctor: '[]'}
				};
			} else {
				return {ctor: '[]'};
			}
		};
		var props = A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			{ctor: '[]'},
			A2(_elm_lang$core$List$map, prop, _p6._1));
		return A2(
			_elm_lang$core$Basics_ops['++'],
			_p6._0,
			A2(
				_elm_lang$core$Basics_ops['++'],
				'{\n',
				A2(
					_elm_lang$core$Basics_ops['++'],
					_gdotdesign$elm_ui$Ui_Css$renderProperties(props),
					'\n}')));
	};
	var renderKeyframe = function (_p8) {
		var _p9 = _p8;
		var renderedBody = A2(
			_elm_lang$core$String$join,
			'\n',
			A2(_elm_lang$core$List$map, renderBody, _p9._1));
		return A2(
			_elm_lang$core$Basics_ops['++'],
			'@keyframes ',
			A2(
				_elm_lang$core$Basics_ops['++'],
				_p9._0,
				A2(
					_elm_lang$core$Basics_ops['++'],
					' {\n',
					A2(_elm_lang$core$Basics_ops['++'], renderedBody, '\n}'))));
	};
	var getFrame = function (node) {
		var _p10 = node;
		switch (_p10.ctor) {
			case 'KeyFrames':
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _p10._0, _1: _p10._1},
					_1: {ctor: '[]'}
				};
			case 'SelectorNode':
				return frames(_p10._0.nodes);
			case 'SelectorsNode':
				return A3(
					_elm_lang$core$List$foldr,
					F2(
						function (x, y) {
							return A2(_elm_lang$core$Basics_ops['++'], x, y);
						}),
					{ctor: '[]'},
					A2(
						_elm_lang$core$List$map,
						function (_p11) {
							return frames(
								function (_) {
									return _.nodes;
								}(_p11));
						},
						_p10._0));
			case 'Mixin':
				return frames(_p10._0);
			default:
				return {ctor: '[]'};
		}
	};
	var frames = function (nds) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			{ctor: '[]'},
			A2(_elm_lang$core$List$map, getFrame, nds));
	};
	var allKeyframes = frames(nodes);
	return A2(
		_elm_lang$core$String$join,
		'\n',
		A2(_elm_lang$core$List$map, renderKeyframe, allKeyframes));
};
var _gdotdesign$elm_ui$Ui_Css$properties = function (node) {
	var getProperty = function (item) {
		var _p12 = item;
		if (_p12.ctor === 'PropertyNode') {
			return {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _p12._0, _1: _p12._1},
				_1: {ctor: '[]'}
			};
		} else {
			return {ctor: '[]'};
		}
	};
	var _p13 = node;
	switch (_p13.ctor) {
		case 'Mixin':
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return A2(_elm_lang$core$Basics_ops['++'], x, y);
					}),
				{ctor: '[]'},
				A2(_elm_lang$core$List$map, getProperty, _p13._0));
		case 'SelectorNode':
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return A2(_elm_lang$core$Basics_ops['++'], x, y);
					}),
				{ctor: '[]'},
				A2(_elm_lang$core$List$map, getProperty, _p13._0.nodes));
		case 'PropertyNode':
			return {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _p13._0, _1: _p13._1},
				_1: {ctor: '[]'}
			};
		default:
			return {ctor: '[]'};
	}
};
var _gdotdesign$elm_ui$Ui_Css$Mixin = function (a) {
	return {ctor: 'Mixin', _0: a};
};
var _gdotdesign$elm_ui$Ui_Css$mixin = function (nodes) {
	return _gdotdesign$elm_ui$Ui_Css$Mixin(nodes);
};
var _gdotdesign$elm_ui$Ui_Css$KeyFrames = F2(
	function (a, b) {
		return {ctor: 'KeyFrames', _0: a, _1: b};
	});
var _gdotdesign$elm_ui$Ui_Css$keyframes = _gdotdesign$elm_ui$Ui_Css$KeyFrames;
var _gdotdesign$elm_ui$Ui_Css$SelectorsNode = function (a) {
	return {ctor: 'SelectorsNode', _0: a};
};
var _gdotdesign$elm_ui$Ui_Css$selectors = F2(
	function (bases, nodes) {
		return _gdotdesign$elm_ui$Ui_Css$SelectorsNode(
			A2(
				_elm_lang$core$List$map,
				function (base) {
					return {name: base, nodes: nodes};
				},
				bases));
	});
var _gdotdesign$elm_ui$Ui_Css$PropertyNode = F2(
	function (a, b) {
		return {ctor: 'PropertyNode', _0: a, _1: b};
	});
var _gdotdesign$elm_ui$Ui_Css$property = _gdotdesign$elm_ui$Ui_Css$PropertyNode;
var _gdotdesign$elm_ui$Ui_Css$SelectorNode = function (a) {
	return {ctor: 'SelectorNode', _0: a};
};
var _gdotdesign$elm_ui$Ui_Css$selector = F2(
	function (base, nodes) {
		return _gdotdesign$elm_ui$Ui_Css$SelectorNode(
			{name: base, nodes: nodes});
	});
var _gdotdesign$elm_ui$Ui_Css$substituteSelector = F2(
	function (selectors, item) {
		return A2(_elm_lang$core$String$contains, '&', item.name) ? A2(
			_elm_lang$core$List$map,
			function (selector) {
				return _gdotdesign$elm_ui$Ui_Css$SelectorNode(
					_elm_lang$core$Native_Utils.update(
						item,
						{
							name: A4(
								_elm_lang$core$Regex$replace,
								_elm_lang$core$Regex$All,
								_elm_lang$core$Regex$regex('\\&'),
								function (_p14) {
									return selector;
								},
								item.name)
						}));
			},
			selectors) : A2(
			_elm_lang$core$List$map,
			function (selector) {
				return _gdotdesign$elm_ui$Ui_Css$SelectorNode(
					_elm_lang$core$Native_Utils.update(
						item,
						{
							name: A2(
								_elm_lang$core$Basics_ops['++'],
								selector,
								A2(_elm_lang$core$Basics_ops['++'], ' ', item.name))
						}));
			},
			selectors);
	});
var _gdotdesign$elm_ui$Ui_Css$flatten = F2(
	function (selectors, node) {
		var _p15 = node;
		switch (_p15.ctor) {
			case 'KeyFrames':
				return selectors;
			case 'Mixin':
				return selectors;
			case 'PropertyNode':
				return selectors;
			case 'SelectorsNode':
				return A3(
					_elm_lang$core$List$foldr,
					F2(
						function (x, y) {
							return A2(_elm_lang$core$Basics_ops['++'], x, y);
						}),
					selectors,
					A2(
						_elm_lang$core$List$map,
						_gdotdesign$elm_ui$Ui_Css$flatten(
							{ctor: '[]'}),
						A2(_elm_lang$core$List$map, _gdotdesign$elm_ui$Ui_Css$SelectorNode, _p15._0)));
			default:
				var _p19 = _p15._0;
				var subSelectors = A2(_elm_lang$core$String$split, ',', _p19.name);
				var subsSelector = function (item_) {
					var _p16 = item_;
					switch (_p16.ctor) {
						case 'SelectorsNode':
							return A3(
								_elm_lang$core$List$foldr,
								F2(
									function (x, y) {
										return A2(_elm_lang$core$Basics_ops['++'], x, y);
									}),
								{ctor: '[]'},
								A2(
									_elm_lang$core$List$map,
									_gdotdesign$elm_ui$Ui_Css$substituteSelector(subSelectors),
									_p16._0));
						case 'SelectorNode':
							return A2(_gdotdesign$elm_ui$Ui_Css$substituteSelector, subSelectors, _p16._0);
						default:
							return {
								ctor: '::',
								_0: item_,
								_1: {ctor: '[]'}
							};
					}
				};
				var mixinNodes = function (nodes) {
					return A3(
						_elm_lang$core$List$foldr,
						F2(
							function (x, y) {
								return A2(_elm_lang$core$Basics_ops['++'], x, y);
							}),
						{ctor: '[]'},
						A2(
							_elm_lang$core$List$map,
							function (item) {
								var _p17 = item;
								if (_p17.ctor === 'Mixin') {
									var _p18 = _p17._0;
									return A2(
										_elm_lang$core$Basics_ops['++'],
										_p18,
										mixinNodes(_p18));
								} else {
									return {
										ctor: '::',
										_0: item,
										_1: {ctor: '[]'}
									};
								}
							},
							nodes));
				};
				var mxNodes = mixinNodes(_p19.nodes);
				var otherSelectors = A3(
					_elm_lang$core$List$foldr,
					F2(
						function (x, y) {
							return A2(_elm_lang$core$Basics_ops['++'], x, y);
						}),
					{ctor: '[]'},
					A2(
						_elm_lang$core$List$map,
						_gdotdesign$elm_ui$Ui_Css$flatten(
							{ctor: '[]'}),
						A3(
							_elm_lang$core$List$foldr,
							F2(
								function (x, y) {
									return A2(_elm_lang$core$Basics_ops['++'], x, y);
								}),
							{ctor: '[]'},
							A2(_elm_lang$core$List$map, subsSelector, mxNodes))));
				return _elm_lang$core$List$concat(
					{
						ctor: '::',
						_0: {
							ctor: '::',
							_0: {
								name: _p19.name,
								properties: _gdotdesign$elm_ui$Ui_Css$properties(
									_gdotdesign$elm_ui$Ui_Css$SelectorNode(
										{name: _p19.name, nodes: mxNodes}))
							},
							_1: {ctor: '[]'}
						},
						_1: {
							ctor: '::',
							_0: otherSelectors,
							_1: {
								ctor: '::',
								_0: selectors,
								_1: {ctor: '[]'}
							}
						}
					});
		}
	});
var _gdotdesign$elm_ui$Ui_Css$resolve = function (nodes) {
	var flattened = A3(
		_elm_lang$core$List$foldr,
		F2(
			function (x, y) {
				return A2(_elm_lang$core$Basics_ops['++'], x, y);
			}),
		{ctor: '[]'},
		A2(
			_elm_lang$core$List$map,
			_gdotdesign$elm_ui$Ui_Css$flatten(
				{ctor: '[]'}),
			nodes));
	var keyframes = _gdotdesign$elm_ui$Ui_Css$getKeyFrames(nodes);
	return A2(
		_elm_lang$core$Basics_ops['++'],
		keyframes,
		A2(
			_elm_lang$core$Basics_ops['++'],
			'\n\n',
			_gdotdesign$elm_ui$Ui_Css$render(flattened)));
};
var _gdotdesign$elm_ui$Ui_Css$embed = function (nodes) {
	return A3(
		_elm_lang$html$Html$node,
		'style',
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(
				_gdotdesign$elm_ui$Ui_Css$resolve(nodes)),
			_1: {ctor: '[]'}
		});
};

var _gdotdesign$elm_ui$Ui_Css_Properties$transition = function (transitions) {
	var render = function (item) {
		return A2(
			_elm_lang$core$String$join,
			' ',
			{
				ctor: '::',
				_0: item.property,
				_1: {
					ctor: '::',
					_0: item.duration,
					_1: {
						ctor: '::',
						_0: item.delay,
						_1: {
							ctor: '::',
							_0: item.easing,
							_1: {ctor: '[]'}
						}
					}
				}
			});
	};
	var value = A2(
		_elm_lang$core$String$join,
		', ',
		A2(_elm_lang$core$List$map, render, transitions));
	return A2(_gdotdesign$elm_ui$Ui_Css$property, 'transition', value);
};
var _gdotdesign$elm_ui$Ui_Css_Properties$animation = function (animations) {
	var render = function (item) {
		return A2(
			_elm_lang$core$String$join,
			' ',
			{
				ctor: '::',
				_0: item.name,
				_1: {
					ctor: '::',
					_0: item.duration,
					_1: {
						ctor: '::',
						_0: item.easing,
						_1: {
							ctor: '::',
							_0: item.delay,
							_1: {
								ctor: '::',
								_0: item.iterationCount,
								_1: {
									ctor: '::',
									_0: item.direction,
									_1: {
										ctor: '::',
										_0: item.fillMode,
										_1: {
											ctor: '::',
											_0: item.playState,
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			});
	};
	var value = A2(
		_elm_lang$core$String$join,
		', ',
		A2(_elm_lang$core$List$map, render, animations));
	return A2(_gdotdesign$elm_ui$Ui_Css$property, 'animation', value);
};
var _gdotdesign$elm_ui$Ui_Css_Properties$boxShadow = function (shadows) {
	var render = function (item) {
		return A2(
			_elm_lang$core$String$join,
			' ',
			{
				ctor: '::',
				_0: item.x,
				_1: {
					ctor: '::',
					_0: item.y,
					_1: {
						ctor: '::',
						_0: item.blur,
						_1: {
							ctor: '::',
							_0: item.spread,
							_1: {
								ctor: '::',
								_0: item.color,
								_1: {
									ctor: '::',
									_0: item.inset ? 'inset' : '',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			});
	};
	var value = A2(
		_elm_lang$core$String$join,
		', ',
		A2(_elm_lang$core$List$map, render, shadows));
	return A2(_gdotdesign$elm_ui$Ui_Css$property, 'box-shadow', value);
};
var _gdotdesign$elm_ui$Ui_Css_Properties$opacity = function (value) {
	return A2(
		_gdotdesign$elm_ui$Ui_Css$property,
		'opacity',
		_elm_lang$core$Basics$toString(value));
};
var _gdotdesign$elm_ui$Ui_Css_Properties$transform = function (transforms) {
	var render = function (item) {
		var _p0 = item;
		switch (_p0.ctor) {
			case 'Scale':
				return A2(
					_elm_lang$core$Basics_ops['++'],
					'scale(',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(_p0._0),
						')'));
			case 'Rotate':
				return A2(
					_elm_lang$core$Basics_ops['++'],
					'rotate(',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(_p0._0),
						'deg)'));
			case 'Translate':
				return A2(
					_elm_lang$core$Basics_ops['++'],
					'translate(',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_p0._0,
						A2(
							_elm_lang$core$Basics_ops['++'],
							',',
							A2(_elm_lang$core$Basics_ops['++'], _p0._1, ')'))));
			case 'TranslateX':
				return A2(
					_elm_lang$core$Basics_ops['++'],
					'translateX(',
					A2(_elm_lang$core$Basics_ops['++'], _p0._0, ')'));
			case 'TranslateY':
				return A2(
					_elm_lang$core$Basics_ops['++'],
					'translateY(',
					A2(_elm_lang$core$Basics_ops['++'], _p0._0, ')'));
			default:
				return A2(
					_elm_lang$core$Basics_ops['++'],
					'translate3d(',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_p0._0,
						A2(
							_elm_lang$core$Basics_ops['++'],
							',',
							A2(
								_elm_lang$core$Basics_ops['++'],
								_p0._1,
								A2(
									_elm_lang$core$Basics_ops['++'],
									',',
									A2(_elm_lang$core$Basics_ops['++'], _p0._2, ')'))))));
		}
	};
	var value = A2(
		_elm_lang$core$String$join,
		' ',
		A2(_elm_lang$core$List$map, render, transforms));
	return A2(_gdotdesign$elm_ui$Ui_Css$property, 'transform', value);
};
var _gdotdesign$elm_ui$Ui_Css_Properties$transformOrigin = F2(
	function (top, left) {
		return A2(
			_gdotdesign$elm_ui$Ui_Css$property,
			'transform-origin',
			A2(
				_elm_lang$core$Basics_ops['++'],
				top,
				A2(_elm_lang$core$Basics_ops['++'], ' ', left)));
	});
var _gdotdesign$elm_ui$Ui_Css_Properties$userSelect = function (value) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: A2(_gdotdesign$elm_ui$Ui_Css$property, '-webkit-user-select', value),
			_1: {
				ctor: '::',
				_0: A2(_gdotdesign$elm_ui$Ui_Css$property, '-moz-user-select', value),
				_1: {
					ctor: '::',
					_0: A2(_gdotdesign$elm_ui$Ui_Css$property, '-ms-user-select', value),
					_1: {
						ctor: '::',
						_0: A2(_gdotdesign$elm_ui$Ui_Css$property, 'user-select', value),
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Css_Properties$maxWidth = _gdotdesign$elm_ui$Ui_Css$property('max-width');
var _gdotdesign$elm_ui$Ui_Css_Properties$maxHeight = _gdotdesign$elm_ui$Ui_Css$property('max-height');
var _gdotdesign$elm_ui$Ui_Css_Properties$minHeight = _gdotdesign$elm_ui$Ui_Css$property('min-height');
var _gdotdesign$elm_ui$Ui_Css_Properties$minWidth = _gdotdesign$elm_ui$Ui_Css$property('min-width');
var _gdotdesign$elm_ui$Ui_Css_Properties$width = _gdotdesign$elm_ui$Ui_Css$property('width');
var _gdotdesign$elm_ui$Ui_Css_Properties$height = _gdotdesign$elm_ui$Ui_Css$property('height');
var _gdotdesign$elm_ui$Ui_Css_Properties$right = _gdotdesign$elm_ui$Ui_Css$property('right');
var _gdotdesign$elm_ui$Ui_Css_Properties$bottom = _gdotdesign$elm_ui$Ui_Css$property('bottom');
var _gdotdesign$elm_ui$Ui_Css_Properties$top = _gdotdesign$elm_ui$Ui_Css$property('top');
var _gdotdesign$elm_ui$Ui_Css_Properties$left = _gdotdesign$elm_ui$Ui_Css$property('left');
var _gdotdesign$elm_ui$Ui_Css_Properties$whiteSpace = _gdotdesign$elm_ui$Ui_Css$property('white-space');
var _gdotdesign$elm_ui$Ui_Css_Properties$textOverflow = _gdotdesign$elm_ui$Ui_Css$property('text-overflow');
var _gdotdesign$elm_ui$Ui_Css_Properties$pointerEvents = _gdotdesign$elm_ui$Ui_Css$property('pointer-events');
var _gdotdesign$elm_ui$Ui_Css_Properties$textAlign = _gdotdesign$elm_ui$Ui_Css$property('text-align');
var _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent = _gdotdesign$elm_ui$Ui_Css$property('justify-content');
var _gdotdesign$elm_ui$Ui_Css_Properties$alignItems = _gdotdesign$elm_ui$Ui_Css$property('align-items');
var _gdotdesign$elm_ui$Ui_Css_Properties$display = _gdotdesign$elm_ui$Ui_Css$property('display');
var _gdotdesign$elm_ui$Ui_Css_Properties$position = _gdotdesign$elm_ui$Ui_Css$property('position');
var _gdotdesign$elm_ui$Ui_Css_Properties$overflowY = _gdotdesign$elm_ui$Ui_Css$property('overflow-y');
var _gdotdesign$elm_ui$Ui_Css_Properties$overflow = _gdotdesign$elm_ui$Ui_Css$property('overflow');
var _gdotdesign$elm_ui$Ui_Css_Properties$color = _gdotdesign$elm_ui$Ui_Css$property('color');
var _gdotdesign$elm_ui$Ui_Css_Properties$zIndex = function (value) {
	return A2(
		_gdotdesign$elm_ui$Ui_Css$property,
		'z-index',
		_elm_lang$core$Basics$toString(value));
};
var _gdotdesign$elm_ui$Ui_Css_Properties$fontFamily = _gdotdesign$elm_ui$Ui_Css$property('font-family');
var _gdotdesign$elm_ui$Ui_Css_Properties$marginRight = _gdotdesign$elm_ui$Ui_Css$property('margin-right');
var _gdotdesign$elm_ui$Ui_Css_Properties$marginLeft = _gdotdesign$elm_ui$Ui_Css$property('margin-left');
var _gdotdesign$elm_ui$Ui_Css_Properties$marginBottom = _gdotdesign$elm_ui$Ui_Css$property('margin-bottom');
var _gdotdesign$elm_ui$Ui_Css_Properties$marginTop = _gdotdesign$elm_ui$Ui_Css$property('margin-top');
var _gdotdesign$elm_ui$Ui_Css_Properties$margin = _gdotdesign$elm_ui$Ui_Css$property('margin');
var _gdotdesign$elm_ui$Ui_Css_Properties$paddingRight = _gdotdesign$elm_ui$Ui_Css$property('padding-right');
var _gdotdesign$elm_ui$Ui_Css_Properties$paddingTop = _gdotdesign$elm_ui$Ui_Css$property('padding-top');
var _gdotdesign$elm_ui$Ui_Css_Properties$paddingLeft = _gdotdesign$elm_ui$Ui_Css$property('padding-left');
var _gdotdesign$elm_ui$Ui_Css_Properties$padding = _gdotdesign$elm_ui$Ui_Css$property('padding');
var _gdotdesign$elm_ui$Ui_Css_Properties$contentString = function (value) {
	return A2(
		_gdotdesign$elm_ui$Ui_Css$property,
		'content',
		A2(
			_elm_lang$core$Basics_ops['++'],
			'\"',
			A2(_elm_lang$core$Basics_ops['++'], value, '\"')));
};
var _gdotdesign$elm_ui$Ui_Css_Properties$content = function (value) {
	return A2(_gdotdesign$elm_ui$Ui_Css$property, 'content', value);
};
var _gdotdesign$elm_ui$Ui_Css_Properties$resize = _gdotdesign$elm_ui$Ui_Css$property('resize');
var _gdotdesign$elm_ui$Ui_Css_Properties$visibility = _gdotdesign$elm_ui$Ui_Css$property('visibility');
var _gdotdesign$elm_ui$Ui_Css_Properties$cursor = _gdotdesign$elm_ui$Ui_Css$property('cursor');
var _gdotdesign$elm_ui$Ui_Css_Properties$fontStyle = _gdotdesign$elm_ui$Ui_Css$property('font-style');
var _gdotdesign$elm_ui$Ui_Css_Properties$fontSize = _gdotdesign$elm_ui$Ui_Css$property('font-size');
var _gdotdesign$elm_ui$Ui_Css_Properties$fontWeight = _gdotdesign$elm_ui$Ui_Css$property('font-weight');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderRadius = _gdotdesign$elm_ui$Ui_Css$property('border-radius');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderColor = _gdotdesign$elm_ui$Ui_Css$property('border-color');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderTopColor = _gdotdesign$elm_ui$Ui_Css$property('border-top-color');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderRightColor = _gdotdesign$elm_ui$Ui_Css$property('border-right-color');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderRight = _gdotdesign$elm_ui$Ui_Css$property('border-right');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderTop = _gdotdesign$elm_ui$Ui_Css$property('border-top');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderBottom = _gdotdesign$elm_ui$Ui_Css$property('border-bottom');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderLeft = _gdotdesign$elm_ui$Ui_Css$property('border-left');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderStyle = _gdotdesign$elm_ui$Ui_Css$property('border-style');
var _gdotdesign$elm_ui$Ui_Css_Properties$borderWidth = _gdotdesign$elm_ui$Ui_Css$property('border-width');
var _gdotdesign$elm_ui$Ui_Css_Properties$border = _gdotdesign$elm_ui$Ui_Css$property('border');
var _gdotdesign$elm_ui$Ui_Css_Properties$important = '!important';
var _gdotdesign$elm_ui$Ui_Css_Properties$outline = _gdotdesign$elm_ui$Ui_Css$property('outline');
var _gdotdesign$elm_ui$Ui_Css_Properties$boxSizing = _gdotdesign$elm_ui$Ui_Css$property('box-sizing');
var _gdotdesign$elm_ui$Ui_Css_Properties$backgroundPositionX = _gdotdesign$elm_ui$Ui_Css$property('background-position-x');
var _gdotdesign$elm_ui$Ui_Css_Properties$backgroundClip = _gdotdesign$elm_ui$Ui_Css$property('background-clip');
var _gdotdesign$elm_ui$Ui_Css_Properties$background = _gdotdesign$elm_ui$Ui_Css$property('background');
var _gdotdesign$elm_ui$Ui_Css_Properties$backgroundSize = _gdotdesign$elm_ui$Ui_Css$property('background-size');
var _gdotdesign$elm_ui$Ui_Css_Properties$backgroundColor = _gdotdesign$elm_ui$Ui_Css$property('background-color');
var _gdotdesign$elm_ui$Ui_Css_Properties$flexDirection = _gdotdesign$elm_ui$Ui_Css$property('flex-direction');
var _gdotdesign$elm_ui$Ui_Css_Properties$lineHeight = _gdotdesign$elm_ui$Ui_Css$property('line-height');
var _gdotdesign$elm_ui$Ui_Css_Properties$alignSelf = _gdotdesign$elm_ui$Ui_Css$property('align-self');
var _gdotdesign$elm_ui$Ui_Css_Properties$flexWrap = _gdotdesign$elm_ui$Ui_Css$property('flex-wrap');
var _gdotdesign$elm_ui$Ui_Css_Properties$flex_ = _gdotdesign$elm_ui$Ui_Css$property('flex');
var _gdotdesign$elm_ui$Ui_Css_Properties$fill = _gdotdesign$elm_ui$Ui_Css$property('fill');
var _gdotdesign$elm_ui$Ui_Css_Properties$wordBreak = _gdotdesign$elm_ui$Ui_Css$property('word-break');
var _gdotdesign$elm_ui$Ui_Css_Properties$wordWrap = _gdotdesign$elm_ui$Ui_Css$property('word-wrap');
var _gdotdesign$elm_ui$Ui_Css_Properties$textDecoration = _gdotdesign$elm_ui$Ui_Css$property('text-decoration');
var _gdotdesign$elm_ui$Ui_Css_Properties$textTransform = _gdotdesign$elm_ui$Ui_Css$property('text-transform');
var _gdotdesign$elm_ui$Ui_Css_Properties$scroll = 'scroll';
var _gdotdesign$elm_ui$Ui_Css_Properties$italic = 'italic';
var _gdotdesign$elm_ui$Ui_Css_Properties$auto = 'auto';
var _gdotdesign$elm_ui$Ui_Css_Properties$colResize = 'col-resize';
var _gdotdesign$elm_ui$Ui_Css_Properties$rowResize = 'row-resize';
var _gdotdesign$elm_ui$Ui_Css_Properties$bold = 'bold';
var _gdotdesign$elm_ui$Ui_Css_Properties$breakWord = 'break-word';
var _gdotdesign$elm_ui$Ui_Css_Properties$normal = 'normal';
var _gdotdesign$elm_ui$Ui_Css_Properties$uppercase = 'uppercase';
var _gdotdesign$elm_ui$Ui_Css_Properties$preWrap = 'pre-wrap';
var _gdotdesign$elm_ui$Ui_Css_Properties$wrap = 'wrap';
var _gdotdesign$elm_ui$Ui_Css_Properties$transparent = 'transparent';
var _gdotdesign$elm_ui$Ui_Css_Properties$currentColor = 'currentColor';
var _gdotdesign$elm_ui$Ui_Css_Properties$spaceAround = 'space-around';
var _gdotdesign$elm_ui$Ui_Css_Properties$spaceBetween = 'space-between';
var _gdotdesign$elm_ui$Ui_Css_Properties$flexEnd = 'flex-end';
var _gdotdesign$elm_ui$Ui_Css_Properties$flexStart = 'flex-start';
var _gdotdesign$elm_ui$Ui_Css_Properties$row = 'row';
var _gdotdesign$elm_ui$Ui_Css_Properties$column = 'column';
var _gdotdesign$elm_ui$Ui_Css_Properties$contentBox = 'content-box';
var _gdotdesign$elm_ui$Ui_Css_Properties$borderBox = 'border-box';
var _gdotdesign$elm_ui$Ui_Css_Properties$pointer = 'pointer';
var _gdotdesign$elm_ui$Ui_Css_Properties$block = 'block';
var _gdotdesign$elm_ui$Ui_Css_Properties$stretch = 'stretch';
var _gdotdesign$elm_ui$Ui_Css_Properties$flex = 'flex';
var _gdotdesign$elm_ui$Ui_Css_Properties$inlineBlock = 'inline-block';
var _gdotdesign$elm_ui$Ui_Css_Properties$inlineFlex = 'inline-flex';
var _gdotdesign$elm_ui$Ui_Css_Properties$dashed = 'dashed';
var _gdotdesign$elm_ui$Ui_Css_Properties$solid = 'solid';
var _gdotdesign$elm_ui$Ui_Css_Properties$center = 'center';
var _gdotdesign$elm_ui$Ui_Css_Properties$nowrap = 'nowrap';
var _gdotdesign$elm_ui$Ui_Css_Properties$ellipsis = 'ellipsis';
var _gdotdesign$elm_ui$Ui_Css_Properties$visible = 'visible';
var _gdotdesign$elm_ui$Ui_Css_Properties$none = 'none';
var _gdotdesign$elm_ui$Ui_Css_Properties$hidden = 'hidden';
var _gdotdesign$elm_ui$Ui_Css_Properties$fixed = 'fixed';
var _gdotdesign$elm_ui$Ui_Css_Properties$relative = 'relative';
var _gdotdesign$elm_ui$Ui_Css_Properties$absolute = 'absolute';
var _gdotdesign$elm_ui$Ui_Css_Properties$inherit = 'inherit';
var _gdotdesign$elm_ui$Ui_Css_Properties$em = function (value) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_elm_lang$core$Basics$toString(value),
		'em');
};
var _gdotdesign$elm_ui$Ui_Css_Properties$vw = function (value) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_elm_lang$core$Basics$toString(value),
		'vw');
};
var _gdotdesign$elm_ui$Ui_Css_Properties$vh = function (value) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_elm_lang$core$Basics$toString(value),
		'vh');
};
var _gdotdesign$elm_ui$Ui_Css_Properties$px = function (value) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_elm_lang$core$Basics$toString(value),
		'px');
};
var _gdotdesign$elm_ui$Ui_Css_Properties$pct = function (value) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_elm_lang$core$Basics$toString(value),
		'%');
};
var _gdotdesign$elm_ui$Ui_Css_Properties$ms = function (value) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_elm_lang$core$Basics$toString(value),
		'ms');
};
var _gdotdesign$elm_ui$Ui_Css_Properties_ops = _gdotdesign$elm_ui$Ui_Css_Properties_ops || {};
_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'] = F2(
	function (a, b) {
		return A2(
			_elm_lang$core$Basics_ops['++'],
			a,
			A2(_elm_lang$core$Basics_ops['++'], ' ', b));
	});
var _gdotdesign$elm_ui$Ui_Css_Properties$zero = '0';
var _gdotdesign$elm_ui$Ui_Css_Properties$Transition = F4(
	function (a, b, c, d) {
		return {easing: a, duration: b, property: c, delay: d};
	});
var _gdotdesign$elm_ui$Ui_Css_Properties$BoxShadow = F6(
	function (a, b, c, d, e, f) {
		return {x: a, y: b, blur: c, spread: d, color: e, inset: f};
	});
var _gdotdesign$elm_ui$Ui_Css_Properties$Animation = F8(
	function (a, b, c, d, e, f, g, h) {
		return {name: a, duration: b, easing: c, delay: d, iterationCount: e, direction: f, fillMode: g, playState: h};
	});
var _gdotdesign$elm_ui$Ui_Css_Properties$Translate3D = F3(
	function (a, b, c) {
		return {ctor: 'Translate3D', _0: a, _1: b, _2: c};
	});
var _gdotdesign$elm_ui$Ui_Css_Properties$translate3d = _gdotdesign$elm_ui$Ui_Css_Properties$Translate3D;
var _gdotdesign$elm_ui$Ui_Css_Properties$Translate = F2(
	function (a, b) {
		return {ctor: 'Translate', _0: a, _1: b};
	});
var _gdotdesign$elm_ui$Ui_Css_Properties$translate = _gdotdesign$elm_ui$Ui_Css_Properties$Translate;
var _gdotdesign$elm_ui$Ui_Css_Properties$TranslateY = function (a) {
	return {ctor: 'TranslateY', _0: a};
};
var _gdotdesign$elm_ui$Ui_Css_Properties$translateY = _gdotdesign$elm_ui$Ui_Css_Properties$TranslateY;
var _gdotdesign$elm_ui$Ui_Css_Properties$TranslateX = function (a) {
	return {ctor: 'TranslateX', _0: a};
};
var _gdotdesign$elm_ui$Ui_Css_Properties$translateX = _gdotdesign$elm_ui$Ui_Css_Properties$TranslateX;
var _gdotdesign$elm_ui$Ui_Css_Properties$Rotate = function (a) {
	return {ctor: 'Rotate', _0: a};
};
var _gdotdesign$elm_ui$Ui_Css_Properties$rotate = _gdotdesign$elm_ui$Ui_Css_Properties$Rotate;
var _gdotdesign$elm_ui$Ui_Css_Properties$Scale = function (a) {
	return {ctor: 'Scale', _0: a};
};
var _gdotdesign$elm_ui$Ui_Css_Properties$scale = _gdotdesign$elm_ui$Ui_Css_Properties$Scale;

var _gdotdesign$elm_ui$Ui_Styles_Theme$default = {
	fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
	borderRadius: _gdotdesign$elm_ui$Ui_Css_Properties$px(2),
	focusShadowsIdle: {
		ctor: '::',
		_0: {
			x: '0',
			y: '0',
			blur: '0',
			spread: _gdotdesign$elm_ui$Ui_Css_Properties$px(1),
			color: 'transparent',
			inset: true
		},
		_1: {
			ctor: '::',
			_0: {
				x: '0',
				y: '0',
				blur: _gdotdesign$elm_ui$Ui_Css_Properties$px(4),
				spread: '0',
				color: 'transparent',
				inset: false
			},
			_1: {
				ctor: '::',
				_0: {
					x: '0',
					y: '0',
					blur: _gdotdesign$elm_ui$Ui_Css_Properties$px(4),
					spread: '0',
					color: 'transparent',
					inset: true
				},
				_1: {ctor: '[]'}
			}
		}
	},
	focusShadows: {
		ctor: '::',
		_0: {
			x: '0',
			y: '0',
			blur: '0',
			spread: _gdotdesign$elm_ui$Ui_Css_Properties$px(1),
			color: '#00C0FF',
			inset: true
		},
		_1: {
			ctor: '::',
			_0: {
				x: '0',
				y: '0',
				blur: _gdotdesign$elm_ui$Ui_Css_Properties$px(4),
				spread: '0',
				color: 'rgba(0,192,255,.5)',
				inset: false
			},
			_1: {
				ctor: '::',
				_0: {
					x: '0',
					y: '0',
					blur: _gdotdesign$elm_ui$Ui_Css_Properties$px(4),
					spread: '0',
					color: 'rgba(0,192,255,.5)',
					inset: true
				},
				_1: {ctor: '[]'}
			}
		}
	},
	colors: {
		background: {color: '#F5F5F5', bw: '#707070'},
		disabled: {color: '#d7d7d7', bw: '#9a9a9a'},
		disabledSecondary: {color: '#a9a9a9', bw: '#cecece'},
		secondary: {color: '#5D7889', bw: '#FFF'},
		warning: {color: '#FF9730 ', bw: '#FFF'},
		primary: {color: '#158DD8', bw: '#FFF'},
		success: {color: '#4DC151', bw: '#FFF'},
		gray: {color: '#E9E9E9', bw: '#616161'},
		inputSecondary: {color: '#f3f3f3', bw: '#616161'},
		input: {color: '#FDFDFD', bw: '#707070'},
		danger: {color: '#E04141', bw: '#FFF'},
		focus: {color: '#00C0FF', bw: '#FFF'},
		borderDisabled: '#C7C7C7',
		border: '#DDD'
	},
	zIndexes: {notifications: 2000, dropdown: 1000, modal: 100, header: 50, fab: 90},
	chooser: {
		hoverColors: {background: '#f0f0f0', text: '#707070'},
		selectedColors: {background: '#158DD8', text: '#FFF'},
		selectedHoverColors: {background: '#1f97e2', text: '#FFF'},
		intendedColors: {background: '#EEE', text: '#707070'},
		intendedHoverColors: {background: '#DDD', text: '#707070'},
		selectedIntendedColors: {background: '#1070ac', text: '#FFF'},
		selectedIntendedHoverColors: {background: '#0c5989', text: '#FFF'}
	},
	breadcrumbs: {background: '#f1f1f1', borderColor: '#d2d2d2', text: '#4a4a4a'},
	scrollbar: {thumbColor: '#d0d0d0', thumbHoverColor: '#b8b8b8', trackColor: '#e9e9e9'},
	header: {
		colors: {backgroundBottom: '#158DD8', backgroundTop: '#1692df', border: '#137fc2', text: '#FFF'}
	}
};
var _gdotdesign$elm_ui$Ui_Styles_Theme$Theme = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return {borderRadius: a, header: b, colors: c, fontFamily: d, focusShadows: e, focusShadowsIdle: f, zIndexes: g, breadcrumbs: h, chooser: i, scrollbar: j};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};

var _gdotdesign$elm_ui$Ui_Styles_Mixins$readonlyCursor = A4(
	_elm_lang$core$Regex$replace,
	_elm_lang$core$Regex$All,
	_elm_lang$core$Regex$regex('\\n\\s*'),
	function (_p0) {
		return '';
	},
	'\n  <svg xmlns=\'http://www.w3.org/2000/svg\' version=\'1\' viewBox=\'0 0 52.548828 24.244142\' width=\'52.549\' height=\'24.244\'>\n    <path d=\'M26.402 0c-.61-.007-1.22.045-1.83.154-1.108.198-2.177.61-3.177 1.122-1.566.8-2.996 1.903-4.242 3.14-.23.228-.46.462-.67.71-.278.33-.278.723 0 1.054.64.756 1.398 1.428 2.17 2.043 1.662 1.325 3.563 2.433 5.66 2.88 1.214.256 2.435.267 3.654.05 1.108-.2 2.177-.612 3.178-1.123 1.566-.8 2.995-1.903 4.24-3.14.232-.228.46-.462.67-.71.113-.112.185-.257.21-.41v-.004l.003-.02.002-.02c0-.003 0-.007.002-.01V5.69c.002-.012.002-.024.002-.037v-.037c0-.01-.002-.017-.003-.025v-.01c0-.007 0-.013-.002-.02l-.003-.02v-.002c-.025-.155-.098-.3-.21-.412-.637-.756-1.396-1.43-2.168-2.043C32.225 1.758 30.324.65 28.225.203 27.62.076 27.01.01 26.402.002zm-.128 1.805c2.126 0 3.848 1.723 3.848 3.848S28.4 9.5 26.274 9.5c-2.125 0-3.848-1.722-3.848-3.847s1.723-3.848 3.848-3.848zm0 2.574A1.274 1.274 0 0 0 25 5.652a1.274 1.274 0 0 0 1.274 1.274 1.274 1.274 0 0 0 1.274-1.274 1.274 1.274 0 0 0-1.274-1.274z\'/>\n    <g style=\'line-height:125%\' font-size=\'10\' font-family=\'sans-serif\' letter-spacing=\'0\' word-spacing=\'0\'>\n      <path d=\'M3.457 20.685q.317.107.615.46.303.35.606.965l1 1.993H4.62l-.93-1.87q-.363-.733-.705-.972-.337-.24-.922-.24H.987v3.083H0v-7.29h2.227q1.25 0 1.865.522t.615 1.577q0 .69-.322 1.143-.318.454-.928.63zm-2.47-3.062v2.588h1.24q.712 0 1.074-.326.367-.332.367-.972 0-.64-.366-.962-.36-.327-1.073-.327H.987zM6.953 16.813h4.61v.83H7.938V19.8h3.47v.83H7.94v2.642h3.71v.83H6.953v-7.29zM15.718 17.784l-1.338 3.628h2.68l-1.342-3.628zm-.557-.97h1.12l2.778 7.29h-1.026l-.664-1.872h-3.286l-.664 1.87h-1.04l2.783-7.29zM21.104 17.623v5.67h1.19q1.51 0 2.208-.685.703-.683.703-2.158 0-1.465-.703-2.143-.698-.684-2.207-.684h-1.19zm-.987-.81h2.027q2.12 0 3.11.883.99.88.99 2.754 0 1.885-.995 2.77-.997.883-3.106.883h-2.027v-7.29zM30.77 17.48q-1.073 0-1.707.802-.63.8-.63 2.183 0 1.377.63 2.178.634.8 1.708.8 1.076 0 1.7-.8.63-.8.63-2.178 0-1.382-.63-2.183-.624-.8-1.7-.8zm0-.8q1.535 0 2.453 1.03.918 1.026.918 2.755 0 1.723-.917 2.754-.918 1.024-2.452 1.024-1.537 0-2.46-1.025-.917-1.027-.917-2.755 0-1.73.918-2.754.923-1.03 2.46-1.03zM35.684 16.813h1.328l3.232 6.098v-6.097h.957v7.29h-1.327l-3.232-6.1v6.1h-.956v-7.29zM43.164 16.813h.986v6.46h3.55v.83h-4.536v-7.29zM46.4 16.813h1.06l2.022 2.998 2.007-2.997h1.06l-2.58 3.818v3.473h-.99V20.63l-2.58-3.817z\'/>\n    </g>\n  </svg>\n  ');
var _gdotdesign$elm_ui$Ui_Styles_Mixins$readonly = _gdotdesign$elm_ui$Ui_Css$mixin(
	{
		ctor: '::',
		_0: _gdotdesign$elm_ui$Ui_Css_Properties$cursor(
			A2(
				_elm_lang$core$Basics_ops['++'],
				'url(\"data:image/svg+xml;utf8,',
				A2(_elm_lang$core$Basics_ops['++'], _gdotdesign$elm_ui$Ui_Styles_Mixins$readonlyCursor, '\") 26 12, auto'))),
		_1: {ctor: '[]'}
	});
var _gdotdesign$elm_ui$Ui_Styles_Mixins$disabledCursor = A4(
	_elm_lang$core$Regex$replace,
	_elm_lang$core$Regex$All,
	_elm_lang$core$Regex$regex('\\n\\s*'),
	function (_p1) {
		return '';
	},
	'\n  <svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 48.901367 31.675499\' width=\'48.901\' height=\'31.675\'>\n    <path d=\'M26.05.127C25.53.043 24.996 0 24.45 0c-5.52 0-10 4.478-10 10s4.48 10 10 10c.546 0 1.08-.044 1.6-.128 4.763-.766 8.4-4.895 8.4-9.872 0-4.978-3.637-9.107-8.4-9.873zM16.778 10c0-4.237 3.436-7.672 7.673-7.672.587 0 1.158.066 1.707.19.926.21 1.788.59 2.555 1.1l-2.555 2.556-8.09 8.085c-.812-1.22-1.29-2.685-1.29-4.26zm9.38 7.48c-.55.126-1.12.19-1.708.19-1.576 0-3.04-.474-4.26-1.29l5.966-5.966L30.83 5.74c.817 1.218 1.29 2.683 1.29 4.26.002 3.65-2.548 6.704-5.963 7.48z\' clip-rule=\'evenodd\' fill-rule=\'evenodd\'/>\n    <g style=\'line-height:125%\' font-size=\'10\' font-family=\'sans-serif\' letter-spacing=\'0\' word-spacing=\'0\'>\n      <path d=\'M.986 25.054v5.67h1.192q1.51 0 2.207-.684.703-.684.703-2.158 0-1.465-.703-2.144-.698-.684-2.207-.684H.986zM0 24.244h2.026q2.12 0 3.11.884.992.88.992 2.754 0 1.884-.996 2.768-.996.884-3.106.884H0v-7.29zM7.695 24.244h.987v7.29h-.987v-7.29zM15.015 24.483v.962q-.562-.27-1.06-.4-.498-.132-.962-.132-.806 0-1.245.312-.435.313-.435.89 0 .482.29.73.292.246 1.102.397l.596.122q1.104.21 1.627.742.527.528.527 1.416 0 1.06-.713 1.607-.707.545-2.08.545-.516 0-1.102-.117-.58-.117-1.206-.346v-1.016q.6.337 1.176.508.576.17 1.133.17.846 0 1.305-.33.46-.333.46-.95 0-.536-.333-.838-.327-.303-1.08-.455l-.6-.116q-1.103-.22-1.597-.688-.493-.47-.493-1.304 0-.967.68-1.523.683-.558 1.88-.558.512 0 1.044.093t1.09.278zM19.624 25.216l-1.338 3.627h2.68l-1.342-3.627zm-.557-.972h1.12l2.777 7.29h-1.026l-.664-1.87h-3.286l-.664 1.87h-1.04l2.783-7.29zM25.01 28.052v2.67h1.582q.796 0 1.177-.326.384-.332.384-1.01 0-.684-.385-1.006-.382-.328-1.178-.328H25.01zm0-2.998v2.198h1.46q.722 0 1.074-.27.356-.272.356-.83 0-.55-.356-.824-.352-.274-1.074-.274h-1.46zm-.987-.81h2.52q1.128 0 1.738.47.612.467.612 1.332 0 .67-.313 1.064-.313.396-.92.493.73.156 1.13.655.404.493.404 1.235 0 .976-.664 1.51-.664.53-1.89.53h-2.617v-7.29zM30.88 24.244h.985v6.46h3.55v.83H30.88v-7.29zM36.445 24.244h4.61v.83h-3.623v2.158h3.47v.83h-3.47v2.642h3.71v.83h-4.697v-7.29zM43.76 25.054v5.67h1.19q1.51 0 2.208-.684.703-.684.703-2.158 0-1.465-.702-2.144-.698-.684-2.207-.684h-1.19zm-.987-.81H44.8q2.12 0 3.11.884.99.88.99 2.754 0 1.884-.995 2.768-.996.884-3.105.884h-2.027v-7.29z\'/>\n    </g>\n  </svg>\n  ');
var _gdotdesign$elm_ui$Ui_Styles_Mixins$disabled = _gdotdesign$elm_ui$Ui_Css$mixin(
	{
		ctor: '::',
		_0: _gdotdesign$elm_ui$Ui_Css_Properties$cursor(
			A2(
				_elm_lang$core$Basics_ops['++'],
				'url(\"data:image/svg+xml;utf8,',
				A2(_elm_lang$core$Basics_ops['++'], _gdotdesign$elm_ui$Ui_Styles_Mixins$disabledCursor, '\") 24 15, auto !important'))),
		_1: {
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Css_Properties$userSelect(_gdotdesign$elm_ui$Ui_Css_Properties$none),
			_1: {ctor: '[]'}
		}
	});
var _gdotdesign$elm_ui$Ui_Styles_Mixins$disabledColors = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Css_Properties$backgroundColor(theme.colors.disabled.color),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.disabled.bw),
				_1: {ctor: '[]'}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Mixins$ellipsis = _gdotdesign$elm_ui$Ui_Css$mixin(
	{
		ctor: '::',
		_0: _gdotdesign$elm_ui$Ui_Css_Properties$textOverflow(_gdotdesign$elm_ui$Ui_Css_Properties$ellipsis),
		_1: {
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Css_Properties$whiteSpace(_gdotdesign$elm_ui$Ui_Css_Properties$nowrap),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$overflow(_gdotdesign$elm_ui$Ui_Css_Properties$hidden),
				_1: {ctor: '[]'}
			}
		}
	});
var _gdotdesign$elm_ui$Ui_Styles_Mixins$focused = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Css_Properties$transition(
				{
					ctor: '::',
					_0: {
						property: 'box-shadow',
						duration: _gdotdesign$elm_ui$Ui_Css_Properties$ms(200),
						easing: 'linear',
						delay: _gdotdesign$elm_ui$Ui_Css_Properties$ms(0)
					},
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$boxShadow(theme.focusShadows),
				_1: {
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Css_Properties$outline(_gdotdesign$elm_ui$Ui_Css_Properties$none),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Mixins$focusedIdle = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Css_Properties$transition(
				{
					ctor: '::',
					_0: {
						property: 'box-shadow',
						duration: _gdotdesign$elm_ui$Ui_Css_Properties$ms(400),
						easing: 'linear',
						delay: _gdotdesign$elm_ui$Ui_Css_Properties$ms(0)
					},
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$boxShadow(theme.focusShadowsIdle),
				_1: {ctor: '[]'}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Mixins$defaults = _gdotdesign$elm_ui$Ui_Css$mixin(
	{
		ctor: '::',
		_0: A2(_gdotdesign$elm_ui$Ui_Css$property, '-webkit-tap-highlight-color', 'rgba(0,0,0,0)'),
		_1: {
			ctor: '::',
			_0: A2(_gdotdesign$elm_ui$Ui_Css$property, '-webkit-touch-callout', _gdotdesign$elm_ui$Ui_Css_Properties$none),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$boxSizing(_gdotdesign$elm_ui$Ui_Css_Properties$borderBox),
				_1: {ctor: '[]'}
			}
		}
	});
var _gdotdesign$elm_ui$Ui_Styles_Mixins$placeholder = function (nodes) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: A2(
				_gdotdesign$elm_ui$Ui_Css$selectors,
				{
					ctor: '::',
					_0: '&::-webkit-input-placeholder',
					_1: {
						ctor: '::',
						_0: '&::-moz-placeholder',
						_1: {
							ctor: '::',
							_0: '&:-ms-input-placeholder',
							_1: {
								ctor: '::',
								_0: '&:-moz-placeholder',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				nodes),
			_1: {ctor: '[]'}
		});
};

var _gdotdesign$elm_ui$Ui_Styles$attributes = function (node) {
	return _elm_lang$lazy$Lazy$lazy(
		function (_p0) {
			var _p1 = _p0;
			var id = A2(
				_Skinney$murmur3$Murmur3$hashString,
				0,
				_elm_lang$core$Basics$toString(node));
			return {
				value: _gdotdesign$elm_ui$Ui_Css$resolve(
					{
						ctor: '::',
						_0: A2(
							_gdotdesign$elm_ui$Ui_Css$selector,
							A2(
								_elm_lang$core$Basics_ops['++'],
								'[style-id=\'',
								A2(
									_elm_lang$core$Basics_ops['++'],
									_elm_lang$core$Basics$toString(id),
									'\']')),
							{
								ctor: '::',
								_0: node,
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}),
				id: id
			};
		});
};
var _gdotdesign$elm_ui$Ui_Styles$apply = function (style) {
	return _elm_lang$lazy$Lazy$force(
		A2(
			_elm_lang$lazy$Lazy$map,
			function (_p2) {
				var _p3 = _p2;
				var _p4 = _p3.id;
				var styles = _elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'id',
							_1: _elm_lang$core$Json_Encode$int(_p4)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'value',
								_1: _elm_lang$core$Json_Encode$string(_p3.value)
							},
							_1: {ctor: '[]'}
						}
					});
				return {
					ctor: '::',
					_0: A2(_elm_lang$html$Html_Attributes$property, '__styles', styles),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html_Attributes$attribute,
							'style-id',
							_elm_lang$core$Basics$toString(_p4)),
						_1: {ctor: '[]'}
					}
				};
			},
			style));
};

var _rluiten$elm_date_extra$Date_Extra_Config$Config = F2(
	function (a, b) {
		return {i18n: a, format: b};
	});

var _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayOfMonthWithSuffix = F2(
	function (pad, day) {
		var value = function () {
			var _p0 = day;
			switch (_p0) {
				case 1:
					return '1st';
				case 21:
					return '21st';
				case 2:
					return '2nd';
				case 22:
					return '22nd';
				case 3:
					return '3rd';
				case 23:
					return '23rd';
				case 31:
					return '31st';
				default:
					return A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(day),
						'th');
			}
		}();
		return pad ? A3(
			_elm_lang$core$String$padLeft,
			4,
			_elm_lang$core$Native_Utils.chr(' '),
			value) : value;
	});
var _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$monthName = function (month) {
	var _p1 = month;
	switch (_p1.ctor) {
		case 'Jan':
			return 'January';
		case 'Feb':
			return 'February';
		case 'Mar':
			return 'March';
		case 'Apr':
			return 'April';
		case 'May':
			return 'May';
		case 'Jun':
			return 'June';
		case 'Jul':
			return 'July';
		case 'Aug':
			return 'August';
		case 'Sep':
			return 'September';
		case 'Oct':
			return 'October';
		case 'Nov':
			return 'November';
		default:
			return 'December';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$monthShort = function (month) {
	var _p2 = month;
	switch (_p2.ctor) {
		case 'Jan':
			return 'Jan';
		case 'Feb':
			return 'Feb';
		case 'Mar':
			return 'Mar';
		case 'Apr':
			return 'Apr';
		case 'May':
			return 'May';
		case 'Jun':
			return 'Jun';
		case 'Jul':
			return 'Jul';
		case 'Aug':
			return 'Aug';
		case 'Sep':
			return 'Sep';
		case 'Oct':
			return 'Oct';
		case 'Nov':
			return 'Nov';
		default:
			return 'Dec';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayName = function (day) {
	var _p3 = day;
	switch (_p3.ctor) {
		case 'Mon':
			return 'Monday';
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Fri':
			return 'Friday';
		case 'Sat':
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayShort = function (day) {
	var _p4 = day;
	switch (_p4.ctor) {
		case 'Mon':
			return 'Mon';
		case 'Tue':
			return 'Tue';
		case 'Wed':
			return 'Wed';
		case 'Thu':
			return 'Thu';
		case 'Fri':
			return 'Fri';
		case 'Sat':
			return 'Sat';
		default:
			return 'Sun';
	}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_en_au$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayOfMonthWithSuffix},
	format: {date: '%-d/%m/%Y', longDate: '%A, %-d %B %Y', time: '%-I:%M %p', longTime: '%-I:%M:%S %p', dateTime: '%-d/%m/%Y %-I:%M %p', firstDayOfWeek: _elm_lang$core$Date$Mon}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_en_us$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayOfMonthWithSuffix},
	format: {date: '%-m/%-d/%Y', longDate: '%A, %B %d, %Y', time: '%-H:%M %p', longTime: '%-H:%M:%S %p', dateTime: '%-m/%-d/%Y %-I:%M %p', firstDayOfWeek: _elm_lang$core$Date$Sun}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_en_gb$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_en_us$dayOfMonthWithSuffix},
	format: {date: '%-d/%m/%Y', longDate: '%A, %-d %B %Y', time: '%-I:%M %p', longTime: '%-I:%M:%S %p', dateTime: '%-d/%m/%Y %-I:%M %p', firstDayOfWeek: _elm_lang$core$Date$Mon}
};

var _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$dayOfMonthWithSuffix = F2(
	function (pad, day) {
		var value = function () {
			var _p0 = day;
			if (_p0 === 1) {
				return '1er';
			} else {
				return _elm_lang$core$Basics$toString(day);
			}
		}();
		return pad ? A3(
			_elm_lang$core$String$padLeft,
			3,
			_elm_lang$core$Native_Utils.chr(' '),
			value) : value;
	});
var _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$monthName = function (month) {
	var _p1 = month;
	switch (_p1.ctor) {
		case 'Jan':
			return 'Janvier';
		case 'Feb':
			return 'Février';
		case 'Mar':
			return 'Mars';
		case 'Apr':
			return 'Avril';
		case 'May':
			return 'Mai';
		case 'Jun':
			return 'Juin';
		case 'Jul':
			return 'Juillet';
		case 'Aug':
			return 'Août';
		case 'Sep':
			return 'Septembre';
		case 'Oct':
			return 'Octobre';
		case 'Nov':
			return 'Novembre';
		default:
			return 'Décembre';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$monthShort = function (month) {
	var _p2 = month;
	switch (_p2.ctor) {
		case 'Jan':
			return 'Jan';
		case 'Feb':
			return 'Fév';
		case 'Mar':
			return 'Mar';
		case 'Apr':
			return 'Avr';
		case 'May':
			return 'Mai';
		case 'Jun':
			return 'Jun';
		case 'Jul':
			return 'Jul';
		case 'Aug':
			return 'Aou';
		case 'Sep':
			return 'Sep';
		case 'Oct':
			return 'Oct';
		case 'Nov':
			return 'Nov';
		default:
			return 'Déc';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$dayName = function (day) {
	var _p3 = day;
	switch (_p3.ctor) {
		case 'Mon':
			return 'Lundi';
		case 'Tue':
			return 'Mardi';
		case 'Wed':
			return 'Mercredi';
		case 'Thu':
			return 'Jeudi';
		case 'Fri':
			return 'Vendredi';
		case 'Sat':
			return 'Samedi';
		default:
			return 'Dimanche';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$dayShort = function (day) {
	var _p4 = day;
	switch (_p4.ctor) {
		case 'Mon':
			return 'Lun';
		case 'Tue':
			return 'Mar';
		case 'Wed':
			return 'Mer';
		case 'Thu':
			return 'Jeu';
		case 'Fri':
			return 'Ven';
		case 'Sat':
			return 'Sam';
		default:
			return 'Dim';
	}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_fr_fr$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_fr_fr$dayOfMonthWithSuffix},
	format: {date: '%-d/%m/%Y', longDate: '%A, %-d %B %Y', time: '%-I:%M %p', longTime: '%-I:%M:%S %p', dateTime: '%-d/%m/%Y %-I:%M %p', firstDayOfWeek: _elm_lang$core$Date$Mon}
};

var _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$dayOfMonthWithSuffix = F2(
	function (pad, day) {
		var _p0 = day;
		return _elm_lang$core$Basics$toString(day);
	});
var _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$monthName = function (month) {
	var _p1 = month;
	switch (_p1.ctor) {
		case 'Jan':
			return 'tammikuuta';
		case 'Feb':
			return 'helmikuuta';
		case 'Mar':
			return 'maaliskuuta';
		case 'Apr':
			return 'huhtikuuta';
		case 'May':
			return 'toukokuuta';
		case 'Jun':
			return 'kesäkuuta';
		case 'Jul':
			return 'heinäkuuta';
		case 'Aug':
			return 'elokuuta';
		case 'Sep':
			return 'syyskuuta';
		case 'Oct':
			return 'lokakuuta';
		case 'Nov':
			return 'marraskuuta';
		default:
			return 'joulukuuta';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$monthShort = function (month) {
	var _p2 = month;
	switch (_p2.ctor) {
		case 'Jan':
			return 'tammi';
		case 'Feb':
			return 'helmi';
		case 'Mar':
			return 'maalis';
		case 'Apr':
			return 'huhti';
		case 'May':
			return 'touko';
		case 'Jun':
			return 'kesä';
		case 'Jul':
			return 'heinä';
		case 'Aug':
			return 'elo';
		case 'Sep':
			return 'syys';
		case 'Oct':
			return 'loka';
		case 'Nov':
			return 'marras';
		default:
			return 'joulu';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$dayName = function (day) {
	var _p3 = day;
	switch (_p3.ctor) {
		case 'Mon':
			return 'maanantai';
		case 'Tue':
			return 'tiistai';
		case 'Wed':
			return 'keskiviikko';
		case 'Thu':
			return 'torstai';
		case 'Fri':
			return 'perjantai';
		case 'Sat':
			return 'lauantai';
		default:
			return 'sunnuntai';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$dayShort = function (day) {
	var _p4 = day;
	switch (_p4.ctor) {
		case 'Mon':
			return 'ma';
		case 'Tue':
			return 'ti';
		case 'Wed':
			return 'ke';
		case 'Thu':
			return 'to';
		case 'Fri':
			return 'pe';
		case 'Sat':
			return 'la';
		default:
			return 'su';
	}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_fi_fi$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_fi_fi$dayOfMonthWithSuffix},
	format: {date: '%-d.%-m.%Y', longDate: '%A, %-d %B %Y', time: '%-H:%M', longTime: '%-H:%M:%S', dateTime: '%-d.%-m.%Y %-H:%M', firstDayOfWeek: _elm_lang$core$Date$Mon}
};

var _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$dayOfMonthWithSuffix = F2(
	function (pad, day) {
		var _p0 = day;
		return _elm_lang$core$Basics$toString(day);
	});
var _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$monthName = function (month) {
	var _p1 = month;
	switch (_p1.ctor) {
		case 'Jan':
			return 'styczeń';
		case 'Feb':
			return 'luty';
		case 'Mar':
			return 'marzec';
		case 'Apr':
			return 'kwiecień';
		case 'May':
			return 'maj';
		case 'Jun':
			return 'czerwiec';
		case 'Jul':
			return 'lipiec';
		case 'Aug':
			return 'sierpień';
		case 'Sep':
			return 'wrzesień';
		case 'Oct':
			return 'październik';
		case 'Nov':
			return 'listopad';
		default:
			return 'grudzień';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$monthShort = function (month) {
	var _p2 = month;
	switch (_p2.ctor) {
		case 'Jan':
			return 'sty';
		case 'Feb':
			return 'lut';
		case 'Mar':
			return 'mar';
		case 'Apr':
			return 'kwi';
		case 'May':
			return 'maj';
		case 'Jun':
			return 'cze';
		case 'Jul':
			return 'lip';
		case 'Aug':
			return 'sie';
		case 'Sep':
			return 'wrz';
		case 'Oct':
			return 'paź';
		case 'Nov':
			return 'lis';
		default:
			return 'gru';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$dayName = function (day) {
	var _p3 = day;
	switch (_p3.ctor) {
		case 'Mon':
			return 'poniedziałek';
		case 'Tue':
			return 'wtorek';
		case 'Wed':
			return 'środa';
		case 'Thu':
			return 'czwartek';
		case 'Fri':
			return 'piątek';
		case 'Sat':
			return 'sobota';
		default:
			return 'niedziela';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$dayShort = function (day) {
	var _p4 = day;
	switch (_p4.ctor) {
		case 'Mon':
			return 'pon';
		case 'Tue':
			return 'wto';
		case 'Wed':
			return 'śro';
		case 'Thu':
			return 'czw';
		case 'Fri':
			return 'pią';
		case 'Sat':
			return 'sob';
		default:
			return 'nie';
	}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_pl_pl$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_pl_pl$dayOfMonthWithSuffix},
	format: {date: '%d.%m.%Y', longDate: '%A, %-d %B %Y', time: '%-H:%M', longTime: '%-H:%M:%S', dateTime: '%-d.%m.%Y %-H:%M', firstDayOfWeek: _elm_lang$core$Date$Mon}
};

var _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$dayOfMonthWithSuffix = F2(
	function (pad, day) {
		var _p0 = day;
		return _elm_lang$core$Basics$toString(day);
	});
var _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$monthName = function (month) {
	var _p1 = month;
	switch (_p1.ctor) {
		case 'Jan':
			return 'Ianuarie';
		case 'Feb':
			return 'Februarie';
		case 'Mar':
			return 'Martie';
		case 'Apr':
			return 'Aprilie';
		case 'May':
			return 'Mai';
		case 'Jun':
			return 'Iunie';
		case 'Jul':
			return 'Iulie';
		case 'Aug':
			return 'August';
		case 'Sep':
			return 'Septembrie';
		case 'Oct':
			return 'Octombrie';
		case 'Nov':
			return 'Noiembrie';
		default:
			return 'Decembrie';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$monthShort = function (month) {
	var _p2 = month;
	switch (_p2.ctor) {
		case 'Jan':
			return 'Ian';
		case 'Feb':
			return 'Feb';
		case 'Mar':
			return 'Mar';
		case 'Apr':
			return 'Apr';
		case 'May':
			return 'Mai';
		case 'Jun':
			return 'Iun';
		case 'Jul':
			return 'Iul';
		case 'Aug':
			return 'Aug';
		case 'Sep':
			return 'Sep';
		case 'Oct':
			return 'Oct';
		case 'Nov':
			return 'Noi';
		default:
			return 'Dec';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$dayName = function (day) {
	var _p3 = day;
	switch (_p3.ctor) {
		case 'Mon':
			return 'Luni';
		case 'Tue':
			return 'Marți';
		case 'Wed':
			return 'Miercuri';
		case 'Thu':
			return 'Joi';
		case 'Fri':
			return 'Vineri';
		case 'Sat':
			return 'Sâmbătă';
		default:
			return 'Duminică';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$dayShort = function (day) {
	var _p4 = day;
	switch (_p4.ctor) {
		case 'Mon':
			return 'Lun';
		case 'Tue':
			return 'Mar';
		case 'Wed':
			return 'Mie';
		case 'Thu':
			return 'Joi';
		case 'Fri':
			return 'Vin';
		case 'Sat':
			return 'Sâm';
		default:
			return 'Dum';
	}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_ro_ro$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_ro_ro$dayOfMonthWithSuffix},
	format: {date: '%d.%m.%Y', longDate: '%A, %-d %B %Y', time: '%-H:%M', longTime: '%-H:%M:%S', dateTime: '%-d.%m.%Y %-H:%M', firstDayOfWeek: _elm_lang$core$Date$Mon}
};

var _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$dayOfMonthWithSuffix = function (_p0) {
	return _elm_lang$core$Basics$toString;
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$monthName = function (month) {
	var _p1 = month;
	switch (_p1.ctor) {
		case 'Jan':
			return 'januari';
		case 'Feb':
			return 'februari';
		case 'Mar':
			return 'maart';
		case 'Apr':
			return 'april';
		case 'May':
			return 'mei';
		case 'Jun':
			return 'juni';
		case 'Jul':
			return 'juli';
		case 'Aug':
			return 'augustus';
		case 'Sep':
			return 'september';
		case 'Oct':
			return 'oktober';
		case 'Nov':
			return 'november';
		default:
			return 'december';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$monthShort = function (month) {
	var _p2 = month;
	switch (_p2.ctor) {
		case 'Jan':
			return 'jan';
		case 'Feb':
			return 'feb';
		case 'Mar':
			return 'mrt';
		case 'Apr':
			return 'apr';
		case 'May':
			return 'mei';
		case 'Jun':
			return 'jun';
		case 'Jul':
			return 'jul';
		case 'Aug':
			return 'aug';
		case 'Sep':
			return 'sep';
		case 'Oct':
			return 'okt';
		case 'Nov':
			return 'nov';
		default:
			return 'dec';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$dayName = function (day) {
	var _p3 = day;
	switch (_p3.ctor) {
		case 'Mon':
			return 'maandag';
		case 'Tue':
			return 'dinsdag';
		case 'Wed':
			return 'woensdag';
		case 'Thu':
			return 'donderdag';
		case 'Fri':
			return 'vrijdag';
		case 'Sat':
			return 'zaterdag';
		default:
			return 'zondag';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$dayShort = function (day) {
	var _p4 = day;
	switch (_p4.ctor) {
		case 'Mon':
			return 'ma';
		case 'Tue':
			return 'di';
		case 'Wed':
			return 'wo';
		case 'Thu':
			return 'do';
		case 'Fri':
			return 'vr';
		case 'Sat':
			return 'za';
		default:
			return 'zo';
	}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_nl_nl$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_nl_nl$dayOfMonthWithSuffix},
	format: {date: '%-m/%-d/%Y', longDate: '%A, %B %d, %Y', time: '%H:%M', longTime: '%-H:%M:%S %p', dateTime: '%-m/%-d/%Y %-I:%M %p', firstDayOfWeek: _elm_lang$core$Date$Mon}
};

var _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$dayOfMonthWithSuffix = F2(
	function (pad, day) {
		var value = function () {
			var _p0 = day;
			if (_p0 === 1) {
				return '1º';
			} else {
				return _elm_lang$core$Basics$toString(day);
			}
		}();
		return pad ? A3(
			_elm_lang$core$String$padLeft,
			2,
			_elm_lang$core$Native_Utils.chr(' '),
			value) : value;
	});
var _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$monthName = function (month) {
	var _p1 = month;
	switch (_p1.ctor) {
		case 'Jan':
			return 'Janeiro';
		case 'Feb':
			return 'Fevereiro';
		case 'Mar':
			return 'Março';
		case 'Apr':
			return 'Abril';
		case 'May':
			return 'Maio';
		case 'Jun':
			return 'Junho';
		case 'Jul':
			return 'Julho';
		case 'Aug':
			return 'Agosto';
		case 'Sep':
			return 'Setembro';
		case 'Oct':
			return 'Outubro';
		case 'Nov':
			return 'Novembro';
		default:
			return 'Dezembro';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$monthShort = function (month) {
	var _p2 = month;
	switch (_p2.ctor) {
		case 'Jan':
			return 'Jan';
		case 'Feb':
			return 'Fev';
		case 'Mar':
			return 'Mar';
		case 'Apr':
			return 'Abr';
		case 'May':
			return 'Mai';
		case 'Jun':
			return 'Jun';
		case 'Jul':
			return 'Jul';
		case 'Aug':
			return 'Ago';
		case 'Sep':
			return 'Set';
		case 'Oct':
			return 'Out';
		case 'Nov':
			return 'Nov';
		default:
			return 'Dez';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$dayName = function (day) {
	var _p3 = day;
	switch (_p3.ctor) {
		case 'Mon':
			return 'Segunda-feira';
		case 'Tue':
			return 'Terça-feira';
		case 'Wed':
			return 'Quarta-feira';
		case 'Thu':
			return 'Quinta-feira';
		case 'Fri':
			return 'Sexta-feira';
		case 'Sat':
			return 'Sábado';
		default:
			return 'Domingo';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$dayShort = function (day) {
	var _p4 = day;
	switch (_p4.ctor) {
		case 'Mon':
			return 'Seg';
		case 'Tue':
			return 'Ter';
		case 'Wed':
			return 'Qua';
		case 'Thu':
			return 'Qui';
		case 'Fri':
			return 'Sex';
		case 'Sat':
			return 'Sáb';
		default:
			return 'Dom';
	}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_pt_br$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_pt_br$dayOfMonthWithSuffix},
	format: {date: '%d/%m/%Y', longDate: '%A, %-d de %B de %Y', time: '%H:%M', longTime: '%H:%M:%S', dateTime: '%d/%m/%Y %H:%M', firstDayOfWeek: _elm_lang$core$Date$Sun}
};

var _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$dayOfMonthWithSuffix = F2(
	function (pad, day) {
		return A2(
			_elm_lang$core$Basics_ops['++'],
			_elm_lang$core$Basics$toString(day),
			'.');
	});
var _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$monthName = function (month) {
	var _p0 = month;
	switch (_p0.ctor) {
		case 'Jan':
			return 'jaanuar';
		case 'Feb':
			return 'veebruar';
		case 'Mar':
			return 'märts';
		case 'Apr':
			return 'aprill';
		case 'May':
			return 'mai';
		case 'Jun':
			return 'juuni';
		case 'Jul':
			return 'juuli';
		case 'Aug':
			return 'august';
		case 'Sep':
			return 'september';
		case 'Oct':
			return 'oktoober';
		case 'Nov':
			return 'november';
		default:
			return 'detsember';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$monthShort = function (month) {
	var _p1 = month;
	switch (_p1.ctor) {
		case 'Jan':
			return 'jaan';
		case 'Feb':
			return 'veebr';
		case 'Mar':
			return 'märts';
		case 'Apr':
			return 'apr';
		case 'May':
			return 'mai';
		case 'Jun':
			return 'juuni';
		case 'Jul':
			return 'juuli';
		case 'Aug':
			return 'aug';
		case 'Sep':
			return 'sept';
		case 'Oct':
			return 'okt';
		case 'Nov':
			return 'nov';
		default:
			return 'dets';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$dayName = function (day) {
	var _p2 = day;
	switch (_p2.ctor) {
		case 'Mon':
			return 'esmaspäev';
		case 'Tue':
			return 'teisipäev';
		case 'Wed':
			return 'kolmapäev';
		case 'Thu':
			return 'neljapäev';
		case 'Fri':
			return 'reede';
		case 'Sat':
			return 'laupäev';
		default:
			return 'pühapäev';
	}
};
var _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$dayShort = function (day) {
	var _p3 = day;
	switch (_p3.ctor) {
		case 'Mon':
			return 'E';
		case 'Tue':
			return 'T';
		case 'Wed':
			return 'K';
		case 'Thu':
			return 'N';
		case 'Fri':
			return 'R';
		case 'Sat':
			return 'L';
		default:
			return 'P';
	}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Config_et_ee$config = {
	i18n: {dayShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$dayShort, dayName: _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$dayName, monthShort: _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$monthShort, monthName: _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$monthName, dayOfMonthWithSuffix: _rluiten$elm_date_extra$Date_Extra_I18n_I_et_ee$dayOfMonthWithSuffix},
	format: {date: '%-d. %b %Y. a', longDate: '%A, %-d. %B %Y', time: '%-H:%M', longTime: '%-H:%M:%S', dateTime: '%a, %-d. %b %Y. %-H:%M:%S', firstDayOfWeek: _elm_lang$core$Date$Mon}
};

var _rluiten$elm_date_extra$Date_Extra_Config_Configs$configs = _elm_lang$core$Dict$fromList(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'en_au', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_en_au$config},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'en_us', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_en_us$config},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'en_gb', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_en_gb$config},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'fr_fr', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_fr_fr$config},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'fi_fi', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_fi_fi$config},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'pl_pl', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_pl_pl$config},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'ro_ro', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_ro_ro$config},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'nl_nl', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_nl_nl$config},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'pt_br', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_pt_br$config},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'et_ee', _1: _rluiten$elm_date_extra$Date_Extra_Config_Config_et_ee$config},
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _rluiten$elm_date_extra$Date_Extra_Config_Configs$getConfig = function (id) {
	var lowerId = _elm_lang$core$String$toLower(id);
	var fixedId = A4(
		_elm_lang$core$Regex$replace,
		_elm_lang$core$Regex$All,
		_elm_lang$core$Regex$regex('-'),
		function (_p0) {
			return '_';
		},
		lowerId);
	return A2(
		_elm_lang$core$Maybe$withDefault,
		_rluiten$elm_date_extra$Date_Extra_Config_Config_en_us$config,
		A2(_elm_lang$core$Dict$get, fixedId, _rluiten$elm_date_extra$Date_Extra_Config_Configs$configs));
};

var _rluiten$elm_date_extra$Date_Extra_Core$prevMonth = function (month) {
	var _p0 = month;
	switch (_p0.ctor) {
		case 'Jan':
			return _elm_lang$core$Date$Dec;
		case 'Feb':
			return _elm_lang$core$Date$Jan;
		case 'Mar':
			return _elm_lang$core$Date$Feb;
		case 'Apr':
			return _elm_lang$core$Date$Mar;
		case 'May':
			return _elm_lang$core$Date$Apr;
		case 'Jun':
			return _elm_lang$core$Date$May;
		case 'Jul':
			return _elm_lang$core$Date$Jun;
		case 'Aug':
			return _elm_lang$core$Date$Jul;
		case 'Sep':
			return _elm_lang$core$Date$Aug;
		case 'Oct':
			return _elm_lang$core$Date$Sep;
		case 'Nov':
			return _elm_lang$core$Date$Oct;
		default:
			return _elm_lang$core$Date$Nov;
	}
};
var _rluiten$elm_date_extra$Date_Extra_Core$nextMonth = function (month) {
	var _p1 = month;
	switch (_p1.ctor) {
		case 'Jan':
			return _elm_lang$core$Date$Feb;
		case 'Feb':
			return _elm_lang$core$Date$Mar;
		case 'Mar':
			return _elm_lang$core$Date$Apr;
		case 'Apr':
			return _elm_lang$core$Date$May;
		case 'May':
			return _elm_lang$core$Date$Jun;
		case 'Jun':
			return _elm_lang$core$Date$Jul;
		case 'Jul':
			return _elm_lang$core$Date$Aug;
		case 'Aug':
			return _elm_lang$core$Date$Sep;
		case 'Sep':
			return _elm_lang$core$Date$Oct;
		case 'Oct':
			return _elm_lang$core$Date$Nov;
		case 'Nov':
			return _elm_lang$core$Date$Dec;
		default:
			return _elm_lang$core$Date$Jan;
	}
};
var _rluiten$elm_date_extra$Date_Extra_Core$intToMonth = function (month) {
	return (_elm_lang$core$Native_Utils.cmp(month, 1) < 1) ? _elm_lang$core$Date$Jan : (_elm_lang$core$Native_Utils.eq(month, 2) ? _elm_lang$core$Date$Feb : (_elm_lang$core$Native_Utils.eq(month, 3) ? _elm_lang$core$Date$Mar : (_elm_lang$core$Native_Utils.eq(month, 4) ? _elm_lang$core$Date$Apr : (_elm_lang$core$Native_Utils.eq(month, 5) ? _elm_lang$core$Date$May : (_elm_lang$core$Native_Utils.eq(month, 6) ? _elm_lang$core$Date$Jun : (_elm_lang$core$Native_Utils.eq(month, 7) ? _elm_lang$core$Date$Jul : (_elm_lang$core$Native_Utils.eq(month, 8) ? _elm_lang$core$Date$Aug : (_elm_lang$core$Native_Utils.eq(month, 9) ? _elm_lang$core$Date$Sep : (_elm_lang$core$Native_Utils.eq(month, 10) ? _elm_lang$core$Date$Oct : (_elm_lang$core$Native_Utils.eq(month, 11) ? _elm_lang$core$Date$Nov : _elm_lang$core$Date$Dec))))))))));
};
var _rluiten$elm_date_extra$Date_Extra_Core$monthToInt = function (month) {
	var _p2 = month;
	switch (_p2.ctor) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		default:
			return 12;
	}
};
var _rluiten$elm_date_extra$Date_Extra_Core$isLeapYear = function (year) {
	return (_elm_lang$core$Native_Utils.eq(
		A2(_elm_lang$core$Basics_ops['%'], year, 4),
		0) && (!_elm_lang$core$Native_Utils.eq(
		A2(_elm_lang$core$Basics_ops['%'], year, 100),
		0))) || _elm_lang$core$Native_Utils.eq(
		A2(_elm_lang$core$Basics_ops['%'], year, 400),
		0);
};
var _rluiten$elm_date_extra$Date_Extra_Core$isLeapYearDate = function (date) {
	return _rluiten$elm_date_extra$Date_Extra_Core$isLeapYear(
		_elm_lang$core$Date$year(date));
};
var _rluiten$elm_date_extra$Date_Extra_Core$yearToDayLength = function (year) {
	return _rluiten$elm_date_extra$Date_Extra_Core$isLeapYear(year) ? 366 : 365;
};
var _rluiten$elm_date_extra$Date_Extra_Core$daysInMonth = F2(
	function (year, month) {
		var _p3 = month;
		switch (_p3.ctor) {
			case 'Jan':
				return 31;
			case 'Feb':
				return _rluiten$elm_date_extra$Date_Extra_Core$isLeapYear(year) ? 29 : 28;
			case 'Mar':
				return 31;
			case 'Apr':
				return 30;
			case 'May':
				return 31;
			case 'Jun':
				return 30;
			case 'Jul':
				return 31;
			case 'Aug':
				return 31;
			case 'Sep':
				return 30;
			case 'Oct':
				return 31;
			case 'Nov':
				return 30;
			default:
				return 31;
		}
	});
var _rluiten$elm_date_extra$Date_Extra_Core$daysInMonthDate = function (date) {
	return A2(
		_rluiten$elm_date_extra$Date_Extra_Core$daysInMonth,
		_elm_lang$core$Date$year(date),
		_elm_lang$core$Date$month(date));
};
var _rluiten$elm_date_extra$Date_Extra_Core$monthList = {
	ctor: '::',
	_0: _elm_lang$core$Date$Jan,
	_1: {
		ctor: '::',
		_0: _elm_lang$core$Date$Feb,
		_1: {
			ctor: '::',
			_0: _elm_lang$core$Date$Mar,
			_1: {
				ctor: '::',
				_0: _elm_lang$core$Date$Apr,
				_1: {
					ctor: '::',
					_0: _elm_lang$core$Date$May,
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Date$Jun,
						_1: {
							ctor: '::',
							_0: _elm_lang$core$Date$Jul,
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Date$Aug,
								_1: {
									ctor: '::',
									_0: _elm_lang$core$Date$Sep,
									_1: {
										ctor: '::',
										_0: _elm_lang$core$Date$Oct,
										_1: {
											ctor: '::',
											_0: _elm_lang$core$Date$Nov,
											_1: {
												ctor: '::',
												_0: _elm_lang$core$Date$Dec,
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _rluiten$elm_date_extra$Date_Extra_Core$toTime = function (_p4) {
	return _elm_lang$core$Basics$floor(
		_elm_lang$core$Date$toTime(_p4));
};
var _rluiten$elm_date_extra$Date_Extra_Core$fromTime = function (_p5) {
	return _elm_lang$core$Date$fromTime(
		_elm_lang$core$Basics$toFloat(_p5));
};
var _rluiten$elm_date_extra$Date_Extra_Core$prevDay = function (day) {
	var _p6 = day;
	switch (_p6.ctor) {
		case 'Mon':
			return _elm_lang$core$Date$Sun;
		case 'Tue':
			return _elm_lang$core$Date$Mon;
		case 'Wed':
			return _elm_lang$core$Date$Tue;
		case 'Thu':
			return _elm_lang$core$Date$Wed;
		case 'Fri':
			return _elm_lang$core$Date$Thu;
		case 'Sat':
			return _elm_lang$core$Date$Fri;
		default:
			return _elm_lang$core$Date$Sat;
	}
};
var _rluiten$elm_date_extra$Date_Extra_Core$nextDay = function (day) {
	var _p7 = day;
	switch (_p7.ctor) {
		case 'Mon':
			return _elm_lang$core$Date$Tue;
		case 'Tue':
			return _elm_lang$core$Date$Wed;
		case 'Wed':
			return _elm_lang$core$Date$Thu;
		case 'Thu':
			return _elm_lang$core$Date$Fri;
		case 'Fri':
			return _elm_lang$core$Date$Sat;
		case 'Sat':
			return _elm_lang$core$Date$Sun;
		default:
			return _elm_lang$core$Date$Mon;
	}
};
var _rluiten$elm_date_extra$Date_Extra_Core$isoDayOfWeek = function (day) {
	var _p8 = day;
	switch (_p8.ctor) {
		case 'Mon':
			return 1;
		case 'Tue':
			return 2;
		case 'Wed':
			return 3;
		case 'Thu':
			return 4;
		case 'Fri':
			return 5;
		case 'Sat':
			return 6;
		default:
			return 7;
	}
};
var _rluiten$elm_date_extra$Date_Extra_Core$daysBackToStartOfWeek = F2(
	function (dateDay, startOfWeekDay) {
		var startOfWeekDayIndex = _rluiten$elm_date_extra$Date_Extra_Core$isoDayOfWeek(startOfWeekDay);
		var dateDayIndex = _rluiten$elm_date_extra$Date_Extra_Core$isoDayOfWeek(dateDay);
		return (_elm_lang$core$Native_Utils.cmp(dateDayIndex, startOfWeekDayIndex) < 0) ? ((7 + dateDayIndex) - startOfWeekDayIndex) : (dateDayIndex - startOfWeekDayIndex);
	});
var _rluiten$elm_date_extra$Date_Extra_Core$ticksAMillisecond = _elm_lang$core$Basics$floor(_elm_lang$core$Time$millisecond);
var _rluiten$elm_date_extra$Date_Extra_Core$ticksASecond = _rluiten$elm_date_extra$Date_Extra_Core$ticksAMillisecond * 1000;
var _rluiten$elm_date_extra$Date_Extra_Core$ticksAMinute = _rluiten$elm_date_extra$Date_Extra_Core$ticksASecond * 60;
var _rluiten$elm_date_extra$Date_Extra_Core$ticksAnHour = _rluiten$elm_date_extra$Date_Extra_Core$ticksAMinute * 60;
var _rluiten$elm_date_extra$Date_Extra_Core$ticksADay = _rluiten$elm_date_extra$Date_Extra_Core$ticksAnHour * 24;
var _rluiten$elm_date_extra$Date_Extra_Core$ticksAWeek = _rluiten$elm_date_extra$Date_Extra_Core$ticksADay * 7;
var _rluiten$elm_date_extra$Date_Extra_Core$firstOfMonthTicks = function (date) {
	var dateTicks = _rluiten$elm_date_extra$Date_Extra_Core$toTime(date);
	var day = _elm_lang$core$Date$day(date);
	return dateTicks + ((1 - day) * _rluiten$elm_date_extra$Date_Extra_Core$ticksADay);
};
var _rluiten$elm_date_extra$Date_Extra_Core$lastOfPrevMonthDate = function (date) {
	return _rluiten$elm_date_extra$Date_Extra_Core$fromTime(
		_rluiten$elm_date_extra$Date_Extra_Core$firstOfMonthTicks(date) - _rluiten$elm_date_extra$Date_Extra_Core$ticksADay);
};
var _rluiten$elm_date_extra$Date_Extra_Core$daysInPrevMonth = function (date) {
	return _rluiten$elm_date_extra$Date_Extra_Core$daysInMonthDate(
		_rluiten$elm_date_extra$Date_Extra_Core$lastOfPrevMonthDate(date));
};
var _rluiten$elm_date_extra$Date_Extra_Core$toFirstOfMonth = function (date) {
	return _rluiten$elm_date_extra$Date_Extra_Core$fromTime(
		_rluiten$elm_date_extra$Date_Extra_Core$firstOfMonthTicks(date));
};
var _rluiten$elm_date_extra$Date_Extra_Core$lastOfMonthTicks = function (date) {
	var dateTicks = _rluiten$elm_date_extra$Date_Extra_Core$toTime(date);
	var day = _elm_lang$core$Date$day(date);
	var month = _elm_lang$core$Date$month(date);
	var year = _elm_lang$core$Date$year(date);
	var daysInMonthVal = A2(_rluiten$elm_date_extra$Date_Extra_Core$daysInMonth, year, month);
	var addDays = daysInMonthVal - day;
	return dateTicks + (addDays * _rluiten$elm_date_extra$Date_Extra_Core$ticksADay);
};
var _rluiten$elm_date_extra$Date_Extra_Core$firstOfNextMonthDate = function (date) {
	return _rluiten$elm_date_extra$Date_Extra_Core$fromTime(
		_rluiten$elm_date_extra$Date_Extra_Core$lastOfMonthTicks(date) + _rluiten$elm_date_extra$Date_Extra_Core$ticksADay);
};
var _rluiten$elm_date_extra$Date_Extra_Core$daysInNextMonth = function (date) {
	return _rluiten$elm_date_extra$Date_Extra_Core$daysInMonthDate(
		_rluiten$elm_date_extra$Date_Extra_Core$firstOfNextMonthDate(date));
};
var _rluiten$elm_date_extra$Date_Extra_Core$lastOfMonthDate = function (date) {
	return _rluiten$elm_date_extra$Date_Extra_Core$fromTime(
		_rluiten$elm_date_extra$Date_Extra_Core$lastOfMonthTicks(date));
};
var _rluiten$elm_date_extra$Date_Extra_Core$epochDateStr = '1970-01-01T00:00:00Z';

var _rluiten$elm_date_extra$Date_Extra_Period$diff = F2(
	function (date1, date2) {
		var millisecondDiff = _elm_lang$core$Date$millisecond(date1) - _elm_lang$core$Date$millisecond(date2);
		var secondDiff = _elm_lang$core$Date$second(date1) - _elm_lang$core$Date$second(date2);
		var minuteDiff = _elm_lang$core$Date$minute(date1) - _elm_lang$core$Date$minute(date2);
		var hourDiff = _elm_lang$core$Date$hour(date1) - _elm_lang$core$Date$hour(date2);
		var ticksDiff = _rluiten$elm_date_extra$Date_Extra_Core$toTime(date1) - _rluiten$elm_date_extra$Date_Extra_Core$toTime(date2);
		var ticksDayDiff = (((ticksDiff - (hourDiff * _rluiten$elm_date_extra$Date_Extra_Core$ticksAnHour)) - (minuteDiff * _rluiten$elm_date_extra$Date_Extra_Core$ticksAMinute)) - (secondDiff * _rluiten$elm_date_extra$Date_Extra_Core$ticksASecond)) - (millisecondDiff * _rluiten$elm_date_extra$Date_Extra_Core$ticksAMillisecond);
		var onlyDaysDiff = (ticksDayDiff / _rluiten$elm_date_extra$Date_Extra_Core$ticksADay) | 0;
		var _p0 = function () {
			if (_elm_lang$core$Native_Utils.cmp(onlyDaysDiff, 0) < 0) {
				var absDayDiff = _elm_lang$core$Basics$abs(onlyDaysDiff);
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Basics$negate((absDayDiff / 7) | 0),
					_1: _elm_lang$core$Basics$negate(
						A2(_elm_lang$core$Basics_ops['%'], absDayDiff, 7))
				};
			} else {
				return {
					ctor: '_Tuple2',
					_0: (onlyDaysDiff / 7) | 0,
					_1: A2(_elm_lang$core$Basics_ops['%'], onlyDaysDiff, 7)
				};
			}
		}();
		var weekDiff = _p0._0;
		var dayDiff = _p0._1;
		return {week: weekDiff, day: dayDiff, hour: hourDiff, minute: minuteDiff, second: secondDiff, millisecond: millisecondDiff};
	});
var _rluiten$elm_date_extra$Date_Extra_Period$addTimeUnit = F3(
	function (unit, addend, date) {
		return _rluiten$elm_date_extra$Date_Extra_Core$fromTime(
			A2(
				F2(
					function (x, y) {
						return x + y;
					}),
				addend * unit,
				_rluiten$elm_date_extra$Date_Extra_Core$toTime(date)));
	});
var _rluiten$elm_date_extra$Date_Extra_Period$toTicks = function (period) {
	var _p1 = period;
	switch (_p1.ctor) {
		case 'Millisecond':
			return _rluiten$elm_date_extra$Date_Extra_Core$ticksAMillisecond;
		case 'Second':
			return _rluiten$elm_date_extra$Date_Extra_Core$ticksASecond;
		case 'Minute':
			return _rluiten$elm_date_extra$Date_Extra_Core$ticksAMinute;
		case 'Hour':
			return _rluiten$elm_date_extra$Date_Extra_Core$ticksAnHour;
		case 'Day':
			return _rluiten$elm_date_extra$Date_Extra_Core$ticksADay;
		case 'Week':
			return _rluiten$elm_date_extra$Date_Extra_Core$ticksAWeek;
		default:
			var _p2 = _p1._0;
			return (((((_rluiten$elm_date_extra$Date_Extra_Core$ticksAMillisecond * _p2.millisecond) + (_rluiten$elm_date_extra$Date_Extra_Core$ticksASecond * _p2.second)) + (_rluiten$elm_date_extra$Date_Extra_Core$ticksAMinute * _p2.minute)) + (_rluiten$elm_date_extra$Date_Extra_Core$ticksAnHour * _p2.hour)) + (_rluiten$elm_date_extra$Date_Extra_Core$ticksADay * _p2.day)) + (_rluiten$elm_date_extra$Date_Extra_Core$ticksAWeek * _p2.week);
	}
};
var _rluiten$elm_date_extra$Date_Extra_Period$add = function (period) {
	return _rluiten$elm_date_extra$Date_Extra_Period$addTimeUnit(
		_rluiten$elm_date_extra$Date_Extra_Period$toTicks(period));
};
var _rluiten$elm_date_extra$Date_Extra_Period$zeroDelta = {week: 0, day: 0, hour: 0, minute: 0, second: 0, millisecond: 0};
var _rluiten$elm_date_extra$Date_Extra_Period$DeltaRecord = F6(
	function (a, b, c, d, e, f) {
		return {week: a, day: b, hour: c, minute: d, second: e, millisecond: f};
	});
var _rluiten$elm_date_extra$Date_Extra_Period$Delta = function (a) {
	return {ctor: 'Delta', _0: a};
};
var _rluiten$elm_date_extra$Date_Extra_Period$Week = {ctor: 'Week'};
var _rluiten$elm_date_extra$Date_Extra_Period$Day = {ctor: 'Day'};
var _rluiten$elm_date_extra$Date_Extra_Period$Hour = {ctor: 'Hour'};
var _rluiten$elm_date_extra$Date_Extra_Period$Minute = {ctor: 'Minute'};
var _rluiten$elm_date_extra$Date_Extra_Period$Second = {ctor: 'Second'};
var _rluiten$elm_date_extra$Date_Extra_Period$Millisecond = {ctor: 'Millisecond'};

var _rluiten$elm_date_extra$Date_Extra_Internal$daysFromCivil = F3(
	function (year, month, day) {
		var doy = (((((153 * (month + ((_elm_lang$core$Native_Utils.cmp(month, 2) > 0) ? -3 : 9))) + 2) / 5) | 0) + day) - 1;
		var y = year - ((_elm_lang$core$Native_Utils.cmp(month, 2) < 1) ? 1 : 0);
		var era = (((_elm_lang$core$Native_Utils.cmp(y, 0) > -1) ? y : (y - 399)) / 400) | 0;
		var yoe = y - (era * 400);
		var doe = (((yoe * 365) + ((yoe / 4) | 0)) - ((yoe / 100) | 0)) + doy;
		return ((era * 146097) + doe) - 719468;
	});
var _rluiten$elm_date_extra$Date_Extra_Internal$ticksFromFields = F7(
	function (year, month, day, hour, minute, second, millisecond) {
		var monthInt = _rluiten$elm_date_extra$Date_Extra_Core$monthToInt(month);
		var c_year = (_elm_lang$core$Native_Utils.cmp(year, 0) < 0) ? 0 : year;
		var c_day = A3(
			_elm_lang$core$Basics$clamp,
			1,
			A2(_rluiten$elm_date_extra$Date_Extra_Core$daysInMonth, c_year, month),
			day);
		var dayCount = A3(_rluiten$elm_date_extra$Date_Extra_Internal$daysFromCivil, c_year, monthInt, c_day);
		return _rluiten$elm_date_extra$Date_Extra_Period$toTicks(
			_rluiten$elm_date_extra$Date_Extra_Period$Delta(
				{
					millisecond: A3(_elm_lang$core$Basics$clamp, 0, 999, millisecond),
					second: A3(_elm_lang$core$Basics$clamp, 0, 59, second),
					minute: A3(_elm_lang$core$Basics$clamp, 0, 59, minute),
					hour: A3(_elm_lang$core$Basics$clamp, 0, 23, hour),
					day: dayCount,
					week: 0
				}));
	});
var _rluiten$elm_date_extra$Date_Extra_Internal$ticksFromDateFields = function (date) {
	return A7(
		_rluiten$elm_date_extra$Date_Extra_Internal$ticksFromFields,
		_elm_lang$core$Date$year(date),
		_elm_lang$core$Date$month(date),
		_elm_lang$core$Date$day(date),
		_elm_lang$core$Date$hour(date),
		_elm_lang$core$Date$minute(date),
		_elm_lang$core$Date$second(date),
		_elm_lang$core$Date$millisecond(date));
};
var _rluiten$elm_date_extra$Date_Extra_Internal$getTimezoneOffset = function (date) {
	var v1Ticks = _rluiten$elm_date_extra$Date_Extra_Internal$ticksFromDateFields(date);
	var dateTicks = _elm_lang$core$Basics$floor(
		_elm_lang$core$Date$toTime(date));
	return ((dateTicks - v1Ticks) / _rluiten$elm_date_extra$Date_Extra_Core$ticksAMinute) | 0;
};
var _rluiten$elm_date_extra$Date_Extra_Internal$hackDateAsOffset = F2(
	function (offsetMinutes, date) {
		return _rluiten$elm_date_extra$Date_Extra_Core$fromTime(
			A2(
				F2(
					function (x, y) {
						return x + y;
					}),
				offsetMinutes * _rluiten$elm_date_extra$Date_Extra_Core$ticksAMinute,
				_rluiten$elm_date_extra$Date_Extra_Core$toTime(date)));
	});
var _rluiten$elm_date_extra$Date_Extra_Internal$hackDateAsUtc = function (date) {
	var offset = _rluiten$elm_date_extra$Date_Extra_Internal$getTimezoneOffset(date);
	var oHours = (offset / _rluiten$elm_date_extra$Date_Extra_Core$ticksAnHour) | 0;
	var oMinutes = ((offset - (oHours * _rluiten$elm_date_extra$Date_Extra_Core$ticksAnHour)) / _rluiten$elm_date_extra$Date_Extra_Core$ticksAMinute) | 0;
	return A2(_rluiten$elm_date_extra$Date_Extra_Internal$hackDateAsOffset, offset, date);
};

var _rluiten$elm_date_extra$Date_Extra_Create$epochDate = _elm_lang$core$Date$fromTime(0);
var _rluiten$elm_date_extra$Date_Extra_Create$epochTimezoneOffset = function () {
	var inMinutes = (_elm_lang$core$Date$hour(_rluiten$elm_date_extra$Date_Extra_Create$epochDate) * 60) + _elm_lang$core$Date$minute(_rluiten$elm_date_extra$Date_Extra_Create$epochDate);
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Date$year(_rluiten$elm_date_extra$Date_Extra_Create$epochDate),
		1969) ? (0 - (inMinutes - (24 * 60))) : (0 - inMinutes);
}();
var _rluiten$elm_date_extra$Date_Extra_Create$getTimezoneOffset = _rluiten$elm_date_extra$Date_Extra_Internal$getTimezoneOffset;
var _rluiten$elm_date_extra$Date_Extra_Create$adjustedTicksToDate = function (ticks) {
	var date = A3(_rluiten$elm_date_extra$Date_Extra_Period$add, _rluiten$elm_date_extra$Date_Extra_Period$Millisecond, ticks + (_rluiten$elm_date_extra$Date_Extra_Create$epochTimezoneOffset * _rluiten$elm_date_extra$Date_Extra_Core$ticksAMinute), _rluiten$elm_date_extra$Date_Extra_Create$epochDate);
	var dateOffset = _rluiten$elm_date_extra$Date_Extra_Create$getTimezoneOffset(date);
	return _elm_lang$core$Native_Utils.eq(dateOffset, _rluiten$elm_date_extra$Date_Extra_Create$epochTimezoneOffset) ? date : A3(_rluiten$elm_date_extra$Date_Extra_Period$add, _rluiten$elm_date_extra$Date_Extra_Period$Minute, dateOffset - _rluiten$elm_date_extra$Date_Extra_Create$epochTimezoneOffset, date);
};
var _rluiten$elm_date_extra$Date_Extra_Create$dateFromFields = F7(
	function (year, month, day, hour, minute, second, millisecond) {
		return _rluiten$elm_date_extra$Date_Extra_Create$adjustedTicksToDate(
			A7(_rluiten$elm_date_extra$Date_Extra_Internal$ticksFromFields, year, month, day, hour, minute, second, millisecond));
	});
var _rluiten$elm_date_extra$Date_Extra_Create$timeFromFields = A3(_rluiten$elm_date_extra$Date_Extra_Create$dateFromFields, 1970, _elm_lang$core$Date$Jan, 1);

var _rluiten$elm_date_extra$Date_Extra_Format$toHourMin = function (offsetMinutes) {
	return {
		ctor: '_Tuple2',
		_0: (offsetMinutes / 60) | 0,
		_1: A2(_elm_lang$core$Basics_ops['%'], offsetMinutes, 60)
	};
};
var _rluiten$elm_date_extra$Date_Extra_Format$padWithN = F2(
	function (n, c) {
		return function (_p0) {
			return A3(
				_elm_lang$core$String$padLeft,
				n,
				c,
				_elm_lang$core$Basics$toString(_p0));
		};
	});
var _rluiten$elm_date_extra$Date_Extra_Format$padWith = function (c) {
	return function (_p1) {
		return A3(
			_elm_lang$core$String$padLeft,
			2,
			c,
			_elm_lang$core$Basics$toString(_p1));
	};
};
var _rluiten$elm_date_extra$Date_Extra_Format$hourMod12 = function (h) {
	return _elm_lang$core$Native_Utils.eq(
		A2(_elm_lang$core$Basics_ops['%'], h, 12),
		0) ? 12 : A2(_elm_lang$core$Basics_ops['%'], h, 12);
};
var _rluiten$elm_date_extra$Date_Extra_Format$formatOffsetStr = F2(
	function (betweenHoursMinutes, offset) {
		var _p2 = _rluiten$elm_date_extra$Date_Extra_Format$toHourMin(
			_elm_lang$core$Basics$abs(offset));
		var hour = _p2._0;
		var minute = _p2._1;
		return A2(
			_elm_lang$core$Basics_ops['++'],
			(_elm_lang$core$Native_Utils.cmp(offset, 0) < 1) ? '+' : '-',
			A2(
				_elm_lang$core$Basics_ops['++'],
				A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					hour),
				A2(
					_elm_lang$core$Basics_ops['++'],
					betweenHoursMinutes,
					A2(
						_rluiten$elm_date_extra$Date_Extra_Format$padWith,
						_elm_lang$core$Native_Utils.chr('0'),
						minute))));
	});
var _rluiten$elm_date_extra$Date_Extra_Format$collapse = function (m) {
	return A2(_elm_lang$core$Maybe$andThen, _elm_lang$core$Basics$identity, m);
};
var _rluiten$elm_date_extra$Date_Extra_Format$formatToken = F4(
	function (config, offset, d, m) {
		var symbol = A2(
			_elm_lang$core$Maybe$withDefault,
			' ',
			_rluiten$elm_date_extra$Date_Extra_Format$collapse(
				_elm_lang$core$List$head(m.submatches)));
		var _p3 = symbol;
		switch (_p3) {
			case 'Y':
				return A3(
					_rluiten$elm_date_extra$Date_Extra_Format$padWithN,
					4,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$year(d));
			case 'y':
				return A2(
					_elm_lang$core$String$right,
					2,
					A3(
						_rluiten$elm_date_extra$Date_Extra_Format$padWithN,
						2,
						_elm_lang$core$Native_Utils.chr('0'),
						_elm_lang$core$Date$year(d)));
			case 'm':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_rluiten$elm_date_extra$Date_Extra_Core$monthToInt(
						_elm_lang$core$Date$month(d)));
			case '_m':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_rluiten$elm_date_extra$Date_Extra_Core$monthToInt(
						_elm_lang$core$Date$month(d)));
			case '-m':
				return _elm_lang$core$Basics$toString(
					_rluiten$elm_date_extra$Date_Extra_Core$monthToInt(
						_elm_lang$core$Date$month(d)));
			case 'B':
				return config.i18n.monthName(
					_elm_lang$core$Date$month(d));
			case '^B':
				return _elm_lang$core$String$toUpper(
					config.i18n.monthName(
						_elm_lang$core$Date$month(d)));
			case 'b':
				return config.i18n.monthShort(
					_elm_lang$core$Date$month(d));
			case '^b':
				return _elm_lang$core$String$toUpper(
					config.i18n.monthShort(
						_elm_lang$core$Date$month(d)));
			case 'd':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$day(d));
			case '-d':
				return _elm_lang$core$Basics$toString(
					_elm_lang$core$Date$day(d));
			case '-@d':
				return A2(
					config.i18n.dayOfMonthWithSuffix,
					false,
					_elm_lang$core$Date$day(d));
			case 'e':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_elm_lang$core$Date$day(d));
			case '@e':
				return A2(
					config.i18n.dayOfMonthWithSuffix,
					true,
					_elm_lang$core$Date$day(d));
			case 'A':
				return config.i18n.dayName(
					_elm_lang$core$Date$dayOfWeek(d));
			case '^A':
				return _elm_lang$core$String$toUpper(
					config.i18n.dayName(
						_elm_lang$core$Date$dayOfWeek(d)));
			case 'a':
				return config.i18n.dayShort(
					_elm_lang$core$Date$dayOfWeek(d));
			case '^a':
				return _elm_lang$core$String$toUpper(
					config.i18n.dayShort(
						_elm_lang$core$Date$dayOfWeek(d)));
			case 'H':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$hour(d));
			case '-H':
				return _elm_lang$core$Basics$toString(
					_elm_lang$core$Date$hour(d));
			case 'k':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_elm_lang$core$Date$hour(d));
			case 'I':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_rluiten$elm_date_extra$Date_Extra_Format$hourMod12(
						_elm_lang$core$Date$hour(d)));
			case '-I':
				return _elm_lang$core$Basics$toString(
					_rluiten$elm_date_extra$Date_Extra_Format$hourMod12(
						_elm_lang$core$Date$hour(d)));
			case 'l':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_rluiten$elm_date_extra$Date_Extra_Format$hourMod12(
						_elm_lang$core$Date$hour(d)));
			case 'p':
				return (_elm_lang$core$Native_Utils.cmp(
					_elm_lang$core$Date$hour(d),
					12) < 0) ? 'AM' : 'PM';
			case 'P':
				return (_elm_lang$core$Native_Utils.cmp(
					_elm_lang$core$Date$hour(d),
					12) < 0) ? 'am' : 'pm';
			case 'M':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$minute(d));
			case 'S':
				return A2(
					_rluiten$elm_date_extra$Date_Extra_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$second(d));
			case 'L':
				return A3(
					_rluiten$elm_date_extra$Date_Extra_Format$padWithN,
					3,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$millisecond(d));
			case '%':
				return symbol;
			case 'z':
				return A2(_rluiten$elm_date_extra$Date_Extra_Format$formatOffsetStr, '', offset);
			case ':z':
				return A2(_rluiten$elm_date_extra$Date_Extra_Format$formatOffsetStr, ':', offset);
			default:
				return '';
		}
	});
var _rluiten$elm_date_extra$Date_Extra_Format$formatRegex = _elm_lang$core$Regex$regex('%(y|Y|m|_m|-m|B|^B|b|^b|d|-d|-@d|e|@e|A|^A|a|^a|H|-H|k|I|-I|l|p|P|M|S|%|L|z|:z)');
var _rluiten$elm_date_extra$Date_Extra_Format$formatOffset = F4(
	function (config, targetOffset, formatStr, date) {
		var dateOffset = _rluiten$elm_date_extra$Date_Extra_Create$getTimezoneOffset(date);
		var hackOffset = dateOffset - targetOffset;
		return A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$All,
			_rluiten$elm_date_extra$Date_Extra_Format$formatRegex,
			A3(
				_rluiten$elm_date_extra$Date_Extra_Format$formatToken,
				config,
				targetOffset,
				A2(_rluiten$elm_date_extra$Date_Extra_Internal$hackDateAsOffset, hackOffset, date)),
			formatStr);
	});
var _rluiten$elm_date_extra$Date_Extra_Format$format = F3(
	function (config, formatStr, date) {
		return A4(
			_rluiten$elm_date_extra$Date_Extra_Format$formatOffset,
			config,
			_rluiten$elm_date_extra$Date_Extra_Create$getTimezoneOffset(date),
			formatStr,
			date);
	});
var _rluiten$elm_date_extra$Date_Extra_Format$formatUtc = F3(
	function (config, formatStr, date) {
		return A4(_rluiten$elm_date_extra$Date_Extra_Format$formatOffset, config, 0, formatStr, date);
	});
var _rluiten$elm_date_extra$Date_Extra_Format$isoDateString = function (date) {
	var day = _elm_lang$core$Date$day(date);
	var month = _elm_lang$core$Date$month(date);
	var year = _elm_lang$core$Date$year(date);
	return A2(
		_elm_lang$core$Basics_ops['++'],
		A3(
			_elm_lang$core$String$padLeft,
			4,
			_elm_lang$core$Native_Utils.chr('0'),
			_elm_lang$core$Basics$toString(year)),
		A2(
			_elm_lang$core$Basics_ops['++'],
			'-',
			A2(
				_elm_lang$core$Basics_ops['++'],
				A3(
					_elm_lang$core$String$padLeft,
					2,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Basics$toString(
						_rluiten$elm_date_extra$Date_Extra_Core$monthToInt(month))),
				A2(
					_elm_lang$core$Basics_ops['++'],
					'-',
					A3(
						_elm_lang$core$String$padLeft,
						2,
						_elm_lang$core$Native_Utils.chr('0'),
						_elm_lang$core$Basics$toString(day))))));
};
var _rluiten$elm_date_extra$Date_Extra_Format$utcIsoDateString = function (date) {
	return _rluiten$elm_date_extra$Date_Extra_Format$isoDateString(
		_rluiten$elm_date_extra$Date_Extra_Internal$hackDateAsUtc(date));
};
var _rluiten$elm_date_extra$Date_Extra_Format$yearInt = function (year) {
	return A3(
		_elm_lang$core$String$padLeft,
		4,
		_elm_lang$core$Native_Utils.chr('0'),
		_elm_lang$core$Basics$toString(year));
};
var _rluiten$elm_date_extra$Date_Extra_Format$year = function (date) {
	return A3(
		_elm_lang$core$String$padLeft,
		4,
		_elm_lang$core$Native_Utils.chr('0'),
		_elm_lang$core$Basics$toString(
			_elm_lang$core$Date$year(date)));
};
var _rluiten$elm_date_extra$Date_Extra_Format$monthMonth = function (month) {
	return A3(
		_elm_lang$core$String$padLeft,
		2,
		_elm_lang$core$Native_Utils.chr('0'),
		_elm_lang$core$Basics$toString(
			_rluiten$elm_date_extra$Date_Extra_Core$monthToInt(month)));
};
var _rluiten$elm_date_extra$Date_Extra_Format$month = function (date) {
	return A3(
		_elm_lang$core$String$padLeft,
		2,
		_elm_lang$core$Native_Utils.chr('0'),
		_elm_lang$core$Basics$toString(
			_rluiten$elm_date_extra$Date_Extra_Core$monthToInt(
				_elm_lang$core$Date$month(date))));
};
var _rluiten$elm_date_extra$Date_Extra_Format$isoTimeFormat = '%H:%M:%S';
var _rluiten$elm_date_extra$Date_Extra_Format$isoDateFormat = '%Y-%m-%d';
var _rluiten$elm_date_extra$Date_Extra_Format$isoMsecOffsetFormat = '%Y-%m-%dT%H:%M:%S.%L%:z';
var _rluiten$elm_date_extra$Date_Extra_Format$isoString = A2(_rluiten$elm_date_extra$Date_Extra_Format$format, _rluiten$elm_date_extra$Date_Extra_Config_Config_en_us$config, _rluiten$elm_date_extra$Date_Extra_Format$isoMsecOffsetFormat);
var _rluiten$elm_date_extra$Date_Extra_Format$isoOffsetFormat = '%Y-%m-%dT%H:%M:%S%z';
var _rluiten$elm_date_extra$Date_Extra_Format$isoMsecFormat = '%Y-%m-%dT%H:%M:%S.%L';
var _rluiten$elm_date_extra$Date_Extra_Format$isoStringNoOffset = A2(_rluiten$elm_date_extra$Date_Extra_Format$format, _rluiten$elm_date_extra$Date_Extra_Config_Config_en_us$config, _rluiten$elm_date_extra$Date_Extra_Format$isoMsecFormat);
var _rluiten$elm_date_extra$Date_Extra_Format$utcIsoString = function (date) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		A3(_rluiten$elm_date_extra$Date_Extra_Format$formatUtc, _rluiten$elm_date_extra$Date_Extra_Config_Config_en_us$config, _rluiten$elm_date_extra$Date_Extra_Format$isoMsecFormat, date),
		'Z');
};
var _rluiten$elm_date_extra$Date_Extra_Format$isoFormat = '%Y-%m-%dT%H:%M:%S';

var _gdotdesign$elm_ui$Ui_Native_FileManager$download = F3(
	function (filename, mimeType, data) {
		return A3(_gdotdesign$elm_ui$Native_FileManager.download, filename, mimeType, data);
	});
var _gdotdesign$elm_ui$Ui_Native_FileManager$openMultipleDecoder = F2(
	function (accept, msg) {
		return A2(
			_elm_lang$core$Json_Decode$map,
			msg,
			_gdotdesign$elm_ui$Native_FileManager.openMultipleDecoder(accept));
	});
var _gdotdesign$elm_ui$Ui_Native_FileManager$openSingleDecoder = F2(
	function (accept, msg) {
		return A2(
			_elm_lang$core$Json_Decode$map,
			msg,
			_gdotdesign$elm_ui$Native_FileManager.openSingleDecoder(accept));
	});
var _gdotdesign$elm_ui$Ui_Native_FileManager$toFormData = F2(
	function (key, file) {
		return A2(
			_elm_lang$http$Http$stringPart,
			key,
			_gdotdesign$elm_ui$Native_FileManager.toFormData(file));
	});
var _gdotdesign$elm_ui$Ui_Native_FileManager$readAsDataURL = function (file) {
	return _gdotdesign$elm_ui$Native_FileManager.readAsDataURL(file);
};
var _gdotdesign$elm_ui$Ui_Native_FileManager$readAsString = function (file) {
	return _gdotdesign$elm_ui$Native_FileManager.readAsString(file);
};
var _gdotdesign$elm_ui$Ui_Native_FileManager$File = F4(
	function (a, b, c, d) {
		return {mimeType: a, name: b, size: c, data: d};
	});
var _gdotdesign$elm_ui$Ui_Native_FileManager$Data = {ctor: 'Data'};

var _gdotdesign$elm_ui$Ui_Helpers_Emitter$onSelfMsg = F3(
	function (router, message, model) {
		return _elm_lang$core$Task$succeed(model);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$onEffects = F4(
	function (router, commands, subscriptions, model) {
		var send = F3(
			function (targetId, value, _p0) {
				var _p1 = _p0;
				return A2(
					_elm_lang$core$Platform$sendToApp,
					router,
					_p1._1(value));
			});
		var sendCommandMessages = function (_p2) {
			var _p3 = _p2;
			var _p6 = _p3._0;
			return A2(
				_elm_lang$core$List$map,
				A2(send, _p6, _p3._1),
				A2(
					_elm_lang$core$List$filter,
					function (_p4) {
						var _p5 = _p4;
						return _elm_lang$core$Native_Utils.eq(_p5._0, _p6);
					},
					subscriptions));
		};
		var tasks = A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			{ctor: '[]'},
			A2(_elm_lang$core$List$map, sendCommandMessages, commands));
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p7) {
				return _elm_lang$core$Task$succeed(model);
			},
			_elm_lang$core$Task$sequence(tasks));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$init = _elm_lang$core$Task$succeed(
	{});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$decode = F4(
	function (decoder, $default, msg, value) {
		return msg(
			A2(
				_elm_lang$core$Result$withDefault,
				$default,
				A2(_elm_lang$core$Json_Decode$decodeValue, decoder, value)));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$decodeString = F2(
	function ($default, msg) {
		return A3(_gdotdesign$elm_ui$Ui_Helpers_Emitter$decode, _elm_lang$core$Json_Decode$string, $default, msg);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$decodeFloat = F2(
	function ($default, msg) {
		return A3(_gdotdesign$elm_ui$Ui_Helpers_Emitter$decode, _elm_lang$core$Json_Decode$float, $default, msg);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$decodeInt = F2(
	function ($default, msg) {
		return A3(_gdotdesign$elm_ui$Ui_Helpers_Emitter$decode, _elm_lang$core$Json_Decode$int, $default, msg);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$decodeBool = F2(
	function ($default, msg) {
		return A3(_gdotdesign$elm_ui$Ui_Helpers_Emitter$decode, _elm_lang$core$Json_Decode$bool, $default, msg);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$subscription = _elm_lang$core$Native_Platform.leaf('Ui.Helpers.Emitter');
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$command = _elm_lang$core$Native_Platform.leaf('Ui.Helpers.Emitter');
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$State = {};
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$Send = F2(
	function (a, b) {
		return {ctor: 'Send', _0: a, _1: b};
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$send = F2(
	function (id, value) {
		return _gdotdesign$elm_ui$Ui_Helpers_Emitter$command(
			A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$Send, id, value));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$sendString = F2(
	function (id, value) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$send,
			id,
			_elm_lang$core$Json_Encode$string(value));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$sendFloat = F2(
	function (id, value) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$send,
			id,
			_elm_lang$core$Json_Encode$float(value));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$sendInt = F2(
	function (id, value) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$send,
			id,
			_elm_lang$core$Json_Encode$int(value));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$sendBool = F2(
	function (id, value) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$send,
			id,
			_elm_lang$core$Json_Encode$bool(value));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$sendFile = F2(
	function (id, value) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$send,
			id,
			_gdotdesign$elm_ui$Native_FileManager.identity(value));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$sendNaked = function (id) {
	return _gdotdesign$elm_ui$Ui_Helpers_Emitter$command(
		A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$Send, id, _elm_lang$core$Json_Encode$null));
};
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$cmdMap = F2(
	function (_p9, _p8) {
		var _p10 = _p8;
		return A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$Send, _p10._0, _p10._1);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$Listen = F2(
	function (a, b) {
		return {ctor: 'Listen', _0: a, _1: b};
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$listen = F2(
	function (id, tagger) {
		return _gdotdesign$elm_ui$Ui_Helpers_Emitter$subscription(
			A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$Listen, id, tagger));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$listenNaked = F2(
	function (id, msg) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$listen,
			id,
			function (_p11) {
				return msg;
			});
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$listenString = F2(
	function (id, tagger) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$listen,
			id,
			A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$decodeString, '', tagger));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$listenFloat = F2(
	function (id, tagger) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$listen,
			id,
			A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$decodeFloat, 0, tagger));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$listenInt = F2(
	function (id, tagger) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$listen,
			id,
			A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$decodeInt, 0, tagger));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$listenBool = F2(
	function (id, tagger) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$listen,
			id,
			A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$decodeBool, false, tagger));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$listenFile = F2(
	function (id, tagger) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$listen,
			id,
			_gdotdesign$elm_ui$Native_FileManager.identitiyTag(tagger));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$subMap = F2(
	function (func, sub) {
		var _p12 = sub;
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$Listen,
			_p12._0,
			function (_p13) {
				return func(
					_p12._1(_p13));
			});
	});
var _gdotdesign$elm_ui$Ui_Helpers_Emitter$Msg = {ctor: 'Msg'};
_elm_lang$core$Native_Platform.effectManagers['Ui.Helpers.Emitter'] = {pkg: 'gdotdesign/elm-ui', init: _gdotdesign$elm_ui$Ui_Helpers_Emitter$init, onEffects: _gdotdesign$elm_ui$Ui_Helpers_Emitter$onEffects, onSelfMsg: _gdotdesign$elm_ui$Ui_Helpers_Emitter$onSelfMsg, tag: 'fx', cmdMap: _gdotdesign$elm_ui$Ui_Helpers_Emitter$cmdMap, subMap: _gdotdesign$elm_ui$Ui_Helpers_Emitter$subMap};

var _gdotdesign$elm_ui$Ui_Native_Uid$uid = _gdotdesign$elm_ui$Native_Uid.uid;

var _gdotdesign$elm_ui$Ui_Styles_Container$style = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$flex),
			_1: {
				ctor: '::',
				_0: A2(
					_gdotdesign$elm_ui$Ui_Css$selector,
					'&[direction=row]',
					{
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Css_Properties$flexDirection(_gdotdesign$elm_ui$Ui_Css_Properties$row),
						_1: {
							ctor: '::',
							_0: A2(
								_gdotdesign$elm_ui$Ui_Css$selector,
								'&:not([compact]) > * + *',
								{
									ctor: '::',
									_0: _gdotdesign$elm_ui$Ui_Css_Properties$marginLeft(
										_gdotdesign$elm_ui$Ui_Css_Properties$px(10)),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_gdotdesign$elm_ui$Ui_Css$selector,
						'&[direction=column]',
						{
							ctor: '::',
							_0: _gdotdesign$elm_ui$Ui_Css_Properties$flexDirection(_gdotdesign$elm_ui$Ui_Css_Properties$column),
							_1: {
								ctor: '::',
								_0: A2(
									_gdotdesign$elm_ui$Ui_Css$selector,
									'&:not([compact]) > * + *',
									{
										ctor: '::',
										_0: _gdotdesign$elm_ui$Ui_Css_Properties$marginTop(
											_gdotdesign$elm_ui$Ui_Css_Properties$px(10)),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_gdotdesign$elm_ui$Ui_Css$selector,
							'&[align=start]',
							{
								ctor: '::',
								_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$flexStart),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_gdotdesign$elm_ui$Ui_Css$selector,
								'&[align=center]',
								{
									ctor: '::',
									_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$center),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_gdotdesign$elm_ui$Ui_Css$selector,
									'&[align=space-between]',
									{
										ctor: '::',
										_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$spaceBetween),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_gdotdesign$elm_ui$Ui_Css$selector,
										'&[align=space-around]',
										{
											ctor: '::',
											_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$spaceAround),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_gdotdesign$elm_ui$Ui_Css$selector,
											'&[align=end]',
											{
												ctor: '::',
												_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$flexEnd),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Container$defaultStyle = _gdotdesign$elm_ui$Ui_Styles$attributes(
	_gdotdesign$elm_ui$Ui_Styles_Container$style(_gdotdesign$elm_ui$Ui_Styles_Theme$default));

var _gdotdesign$elm_ui$Ui_Container$basAttributes = function (model) {
	return _elm_lang$core$List$concat(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui$attributeList(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'compact', _1: model.compact},
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Styles$apply(_gdotdesign$elm_ui$Ui_Styles_Container$defaultStyle),
				_1: {
					ctor: '::',
					_0: {
						ctor: '::',
						_0: A2(_elm_lang$html$Html_Attributes$attribute, 'direction', model.direction),
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$html$Html_Attributes$attribute, 'align', model.align),
							_1: {ctor: '[]'}
						}
					},
					_1: {ctor: '[]'}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Container$columnOptions = {direction: 'column', compact: false, align: 'start'};
var _gdotdesign$elm_ui$Ui_Container$rowOptions = {direction: 'row', compact: false, align: 'start'};
var _gdotdesign$elm_ui$Ui_Container$render = F3(
	function (model, attributes, children) {
		return A3(
			_elm_lang$html$Html$node,
			'ui-container',
			A2(
				_elm_lang$core$Basics_ops['++'],
				_gdotdesign$elm_ui$Ui_Container$basAttributes(model),
				attributes),
			children);
	});
var _gdotdesign$elm_ui$Ui_Container$row = F2(
	function (attributes, children) {
		return A4(_elm_lang$html$Html_Lazy$lazy3, _gdotdesign$elm_ui$Ui_Container$render, _gdotdesign$elm_ui$Ui_Container$rowOptions, attributes, children);
	});
var _gdotdesign$elm_ui$Ui_Container$rowCenter = F2(
	function (attributes, children) {
		return A4(
			_elm_lang$html$Html_Lazy$lazy3,
			_gdotdesign$elm_ui$Ui_Container$render,
			_elm_lang$core$Native_Utils.update(
				_gdotdesign$elm_ui$Ui_Container$rowOptions,
				{align: 'center'}),
			attributes,
			children);
	});
var _gdotdesign$elm_ui$Ui_Container$rowEnd = F2(
	function (attributes, children) {
		return A4(
			_elm_lang$html$Html_Lazy$lazy3,
			_gdotdesign$elm_ui$Ui_Container$render,
			_elm_lang$core$Native_Utils.update(
				_gdotdesign$elm_ui$Ui_Container$rowOptions,
				{align: 'end'}),
			attributes,
			children);
	});
var _gdotdesign$elm_ui$Ui_Container$column = F2(
	function (attributes, children) {
		return A4(_elm_lang$html$Html_Lazy$lazy3, _gdotdesign$elm_ui$Ui_Container$render, _gdotdesign$elm_ui$Ui_Container$columnOptions, attributes, children);
	});
var _gdotdesign$elm_ui$Ui_Container$columnCenter = F2(
	function (attributes, children) {
		return A4(
			_elm_lang$html$Html_Lazy$lazy3,
			_gdotdesign$elm_ui$Ui_Container$render,
			_elm_lang$core$Native_Utils.update(
				_gdotdesign$elm_ui$Ui_Container$columnOptions,
				{align: 'center'}),
			attributes,
			children);
	});
var _gdotdesign$elm_ui$Ui_Container$columnEnd = F2(
	function (attributes, children) {
		return A4(
			_elm_lang$html$Html_Lazy$lazy3,
			_gdotdesign$elm_ui$Ui_Container$render,
			_elm_lang$core$Native_Utils.update(
				_gdotdesign$elm_ui$Ui_Container$columnOptions,
				{align: 'end'}),
			attributes,
			children);
	});
var _gdotdesign$elm_ui$Ui_Container$view = F3(
	function (model, attributes, children) {
		return A4(_elm_lang$html$Html_Lazy$lazy3, _gdotdesign$elm_ui$Ui_Container$render, model, attributes, children);
	});
var _gdotdesign$elm_ui$Ui_Container$Model = F3(
	function (a, b, c) {
		return {direction: a, align: b, compact: c};
	});

var _gdotdesign$elm_ui$Ui_Icons$icon = F2(
	function (iconPath, attributes) {
		return A2(
			_elm_lang$svg$Svg$svg,
			A2(
				_elm_lang$core$Basics_ops['++'],
				{
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$width('36'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$height('36'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$viewBox('0 0 36 36'),
							_1: {ctor: '[]'}
						}
					}
				},
				attributes),
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$path,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$d(iconPath),
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			});
	});
var _gdotdesign$elm_ui$Ui_Icons$backspace = _gdotdesign$elm_ui$Ui_Icons$icon('\n    M35.082 6.578c-.626-.626-1.424-.953-2.325-.953H11.813c-1.71\n    0-3.074.66-4.058 2L0 17.995 7.763 28.3l.012.017.013.016c.486.624 1.014\n    1.105 1.617 1.437.712.392 1.522.608 2.407.608h20.954c1.84 0 3.234-1.565\n    3.234-3.445v-18c0-.902-.292-1.726-.918-2.352zM29.07\n    23.365c.108.107.167.25.167.402 0 .15-.06.295-.167.4l-1.534\n    1.54c-.11.113-.255.168-.4.168-.146 0-.29-.055-.4-.167l-5.36-5.376-5.36\n    5.376c-.11.112-.256.167-.4.167-.146\n    0-.29-.055-.4-.167l-1.536-1.54c-.107-.106-.167-.25-.167-.4\n    0-.152.06-.296.167-.403L19.062 18l-5.396-5.365c-.22-.22-.22-.58\n    0-.803l1.533-1.54c.106-.108.25-.167.4-.167.15 0 .294.06.4.166l5.375 5.312\n    5.375-5.31c.106-.108.25-.167.4-.167.15 0 .294.06.4.166l1.534\n    1.542c.222.222.222.582 0 .803L23.69 18l5.38 5.365z\n    ');
var _gdotdesign$elm_ui$Ui_Icons$checkmark = _gdotdesign$elm_ui$Ui_Icons$icon('\n    M35.792 5.332L31.04 1.584c-.147-.12-.33-.208-.537-.208-.207\n    0-.398.087-.545.217l-17.286 22.21S5.877 17.27 5.687\n    17.08c-.19-.19-.442-.51-.822-.51-.38 0-.554.268-.753.467-.148.156-2.57\n    2.7-3.766 3.964-.07.077-.112.12-.173.18-.104.148-.173.313-.173.494 0\n    .19.07.347.173.494l.242.225s12.058 11.582 12.257 11.78c.2.2.442.45.797.45.345\n    0 .63-.37.795-.536l21.562-27.7c.104-.146.173-.31.173-.5 0-.217-.087-.4-.208-.555z\n    ');
var _gdotdesign$elm_ui$Ui_Icons$chevronLeft = _gdotdesign$elm_ui$Ui_Icons$icon('\n    M14.597 17.996L28.037\n    4c.34-.345.33-.916-.015-1.27L25.618.27c-.345-.353-.908-.36-1.246-.016L7.957\n    17.344c-.177.178-.257.42-.24.652-.01.24.07.474.24.65l16.415\n    17.1c.338.345.9.337 1.246-.016l2.404-2.46c.346-.354.354-.925.016-1.27l-13.44-14.004z\n    ');
var _gdotdesign$elm_ui$Ui_Icons$chevronRight = _gdotdesign$elm_ui$Ui_Icons$icon('\n    M21.403 17.996L7.963 4c-.34-.345-.33-.916.015-1.27L10.382.27c.345-.353.908-.36\n    1.246-.016l16.415 17.1c.177.176.257.417.24.65.01.24-.07.474-.24.65L11.628\n    35.747c-.338.345-.9.337-1.246-.016l-2.404-2.46c-.346-.354-.354-.925-.016-1.27l13.44-14.004z\n    ');
var _gdotdesign$elm_ui$Ui_Icons$close = _gdotdesign$elm_ui$Ui_Icons$icon('\n    M35.592 30.256l-12.3-12.34L35.62 5.736c.507-.507.507-1.332\n    0-1.838L32.114.375C31.87.13 31.542 0 31.194 0c-.346\n    0-.674.14-.917.375L18.005 12.518 5.715.384C5.47.14 5.14.01\n    4.794.01c-.347 0-.675.14-.918.374L.38 3.907c-.507.506-.507\n    1.33 0 1.837l12.328 12.18L.418 30.257c-.245.244-.385.572-.385.918\n    0 .347.13.675.384.92l3.506 3.522c.254.253.582.384.92.384.327 0\n    .665-.122.918-.384l12.245-12.294 12.253\n    12.284c.253.253.58.385.92.385.327 0\n    .664-.12.917-.384l3.507-3.523c.243-.243.384-.57.384-.918-.01-.337-.15-.665-.394-.91z\n    ');
var _gdotdesign$elm_ui$Ui_Icons$plus = _gdotdesign$elm_ui$Ui_Icons$icon('M0 21h15v15h6V21h15v-6H21V0h-6v15H0');
var _gdotdesign$elm_ui$Ui_Icons$search = _gdotdesign$elm_ui$Ui_Icons$icon('\n    M35.72 30.245l-7.95-8.05c1.293-2.26 1.968-4.77 1.968-7.302C29.738\n    6.683 23.063 0 14.868 0 6.676 0 0 6.683 0 14.893s6.675 14.893 14.87\n    14.893c2.614 0 5.202-.722 7.508-2.1l7.913\n    8.023c.18.178.432.29.685.29.253 0\n    .506-.103.684-.29l4.06-4.106c.374-.384.374-.984 0-1.36zM14.87\n    5.802c5.005 0 9.074 4.077 9.074 9.09 0 5.015-4.07 9.092-9.075\n    9.092-5.008 0-9.076-4.077-9.076-9.09 0-5.015 4.068-9.092 9.075-9.092z\n    ');
var _gdotdesign$elm_ui$Ui_Icons$starFull = _gdotdesign$elm_ui$Ui_Icons$icon('\n    M23.055 12.826L18 .89l-5.056 11.936L0 13.936l9.82 8.514-2.944 12.66L18\n    28.397l11.123 6.71L26.18 22.45 36 13.937\n    ');
var _gdotdesign$elm_ui$Ui_Icons$starEmpty = _gdotdesign$elm_ui$Ui_Icons$icon('\n    M36 13.937l-12.945-1.11L18 .89l-5.056 11.936L0 13.936l9.82 8.513-2.944\n    12.66L18 28.397l11.123 6.71L26.18 22.45 36 13.937zm-16.527 12.02L18\n    25.066l-1.473.89-5.345 3.224 1.415-6.085.39-1.674-1.3-1.125L6.965\n    16.2l6.223-.533 1.71-.147.67-1.582L18 8.2l2.43 5.738.67 1.582 1.712.147\n    6.223.534-4.722 4.095-1.3 1.126.39 1.675 1.415 6.086-5.345-3.224z\n    ');
var _gdotdesign$elm_ui$Ui_Icons$calendar = _gdotdesign$elm_ui$Ui_Icons$icon('\n    M9 0C7.578 0 6.428 1.15 6.428 2.572v2.57c0 1.423 1.15 2.573 2.572 2.573\n    1.422 0 2.572-1.15 2.572-2.572v-2.57C11.572 1.15 10.422 0 9 0zm18 0c-1.422\n    0-2.572 1.15-2.572 2.572v2.57c0 1.423 1.15 2.573 2.572 2.573 1.422 0\n    2.572-1.15 2.572-2.572v-2.57C29.572 1.15 28.422 0 27 0zM.643 2.572c-.354\n    0-.643.29-.643.643v32.142c0 .354.29.643.643.643h34.714c.354 0\n    .643-.29.643-.643V3.215c0-.354-.29-.643-.643-.643h-4.5v3.27C30.857 7.65\n    28.993 9 27.064 9c-1.928 0-3.92-1.35-3.92-3.158v-3.27H12.856v3.27C12.857\n    7.65 10.93 9 9 9 7.07 9 5.143 7.65 5.143 5.842v-3.27h-4.5zm3.214\n    9h28.286v20.57H3.857v-20.57z\n    ');

var _gdotdesign$elm_ui$Ui_Styles_Calendar$style = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$defaults,
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$border(
					A2(
						_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
						A2(
							_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
							_gdotdesign$elm_ui$Ui_Css_Properties$px(1),
							_gdotdesign$elm_ui$Ui_Css_Properties$solid),
						theme.colors.border)),
				_1: {
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Css_Properties$backgroundColor(theme.colors.input.color),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Css_Properties$transform(
							{
								ctor: '::',
								_0: A3(_gdotdesign$elm_ui$Ui_Css_Properties$translate3d, _gdotdesign$elm_ui$Ui_Css_Properties$zero, _gdotdesign$elm_ui$Ui_Css_Properties$zero, _gdotdesign$elm_ui$Ui_Css_Properties$zero),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderRadius(theme.borderRadius),
							_1: {
								ctor: '::',
								_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.input.bw),
								_1: {
									ctor: '::',
									_0: _gdotdesign$elm_ui$Ui_Css_Properties$fontFamily(theme.fontFamily),
									_1: {
										ctor: '::',
										_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$inlineBlock),
										_1: {
											ctor: '::',
											_0: _gdotdesign$elm_ui$Ui_Css_Properties$userSelect(_gdotdesign$elm_ui$Ui_Css_Properties$none),
											_1: {
												ctor: '::',
												_0: _gdotdesign$elm_ui$Ui_Css_Properties$padding(
													_gdotdesign$elm_ui$Ui_Css_Properties$px(15)),
												_1: {
													ctor: '::',
													_0: A2(
														_gdotdesign$elm_ui$Ui_Css$selector,
														'> ui-container',
														{
															ctor: '::',
															_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderBottom(
																A2(
																	_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																	A2(
																		_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																		_gdotdesign$elm_ui$Ui_Css_Properties$px(1),
																		_gdotdesign$elm_ui$Ui_Css_Properties$dashed),
																	theme.colors.border)),
															_1: {
																ctor: '::',
																_0: _gdotdesign$elm_ui$Ui_Css_Properties$padding(
																	A2(
																		_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																		A2(
																			_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																			A2(
																				_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																				_gdotdesign$elm_ui$Ui_Css_Properties$zero,
																				_gdotdesign$elm_ui$Ui_Css_Properties$px(5)),
																			_gdotdesign$elm_ui$Ui_Css_Properties$px(10)),
																		_gdotdesign$elm_ui$Ui_Css_Properties$px(5))),
																_1: {
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$alignItems(_gdotdesign$elm_ui$Ui_Css_Properties$center),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(
																			_gdotdesign$elm_ui$Ui_Css_Properties$px(35)),
																		_1: {
																			ctor: '::',
																			_0: A2(
																				_gdotdesign$elm_ui$Ui_Css$selector,
																				'div',
																				{
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$center),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$relative),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$alignItems(_gdotdesign$elm_ui$Ui_Css_Properties$center),
																							_1: {
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$flex),
																								_1: {
																									ctor: '::',
																									_0: _gdotdesign$elm_ui$Ui_Css_Properties$top(
																										_gdotdesign$elm_ui$Ui_Css_Properties$px(2)),
																									_1: {
																										ctor: '::',
																										_0: _gdotdesign$elm_ui$Ui_Css_Properties$flex_('1'),
																										_1: {ctor: '[]'}
																									}
																								}
																							}
																						}
																					}
																				}),
																			_1: {
																				ctor: '::',
																				_0: A2(
																					_gdotdesign$elm_ui$Ui_Css$selector,
																					'svg',
																					{
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$fill(_gdotdesign$elm_ui$Ui_Css_Properties$currentColor),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$cursor(_gdotdesign$elm_ui$Ui_Css_Properties$pointer),
																							_1: {
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(
																									_gdotdesign$elm_ui$Ui_Css_Properties$px(16)),
																								_1: {
																									ctor: '::',
																									_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
																										_gdotdesign$elm_ui$Ui_Css_Properties$px(16)),
																									_1: {
																										ctor: '::',
																										_0: A2(
																											_gdotdesign$elm_ui$Ui_Css$selector,
																											'&:hover',
																											{
																												ctor: '::',
																												_0: _gdotdesign$elm_ui$Ui_Css_Properties$fill(theme.colors.focus.color),
																												_1: {ctor: '[]'}
																											}),
																										_1: {ctor: '[]'}
																									}
																								}
																							}
																						}
																					}),
																				_1: {ctor: '[]'}
																			}
																		}
																	}
																}
															}
														}),
													_1: {
														ctor: '::',
														_0: A2(
															_gdotdesign$elm_ui$Ui_Css$selector,
															'ui-calendar-table',
															{
																ctor: '::',
																_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$spaceAround),
																_1: {
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
																		_gdotdesign$elm_ui$Ui_Css_Properties$px(300)),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$flexWrap(_gdotdesign$elm_ui$Ui_Css_Properties$wrap),
																		_1: {
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$flex),
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}),
														_1: {
															ctor: '::',
															_0: A2(
																_gdotdesign$elm_ui$Ui_Css$selector,
																'ui-calendar-header',
																{
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderBottom(
																		A2(
																			_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																			A2(
																				_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																				_gdotdesign$elm_ui$Ui_Css_Properties$px(1),
																				_gdotdesign$elm_ui$Ui_Css_Properties$dashed),
																			theme.colors.border)),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$spaceAround),
																		_1: {
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$marginBottom(
																				_gdotdesign$elm_ui$Ui_Css_Properties$px(5)),
																			_1: {
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
																					_gdotdesign$elm_ui$Ui_Css_Properties$px(300)),
																				_1: {
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$flex),
																					_1: {
																						ctor: '::',
																						_0: A2(
																							_gdotdesign$elm_ui$Ui_Css$selector,
																							'span',
																							{
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$textTransform(_gdotdesign$elm_ui$Ui_Css_Properties$uppercase),
																								_1: {
																									ctor: '::',
																									_0: _gdotdesign$elm_ui$Ui_Css_Properties$margin(
																										A2(
																											_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																											_gdotdesign$elm_ui$Ui_Css_Properties$px(7),
																											_gdotdesign$elm_ui$Ui_Css_Properties$zero)),
																									_1: {
																										ctor: '::',
																										_0: _gdotdesign$elm_ui$Ui_Css_Properties$textAlign(_gdotdesign$elm_ui$Ui_Css_Properties$center),
																										_1: {
																											ctor: '::',
																											_0: _gdotdesign$elm_ui$Ui_Css_Properties$fontSize(
																												_gdotdesign$elm_ui$Ui_Css_Properties$px(12)),
																											_1: {
																												ctor: '::',
																												_0: _gdotdesign$elm_ui$Ui_Css_Properties$fontWeight(_gdotdesign$elm_ui$Ui_Css_Properties$bold),
																												_1: {
																													ctor: '::',
																													_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
																														_gdotdesign$elm_ui$Ui_Css_Properties$px(34)),
																													_1: {
																														ctor: '::',
																														_0: _gdotdesign$elm_ui$Ui_Css_Properties$opacity(0.7),
																														_1: {ctor: '[]'}
																													}
																												}
																											}
																										}
																									}
																								}
																							}),
																						_1: {ctor: '[]'}
																					}
																				}
																			}
																		}
																	}
																}),
															_1: {
																ctor: '::',
																_0: A2(
																	_gdotdesign$elm_ui$Ui_Css$selector,
																	'ui-calendar-cell',
																	{
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderRadius(theme.borderRadius),
																		_1: {
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$center),
																			_1: {
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$lineHeight(
																					_gdotdesign$elm_ui$Ui_Css_Properties$px(36)),
																				_1: {
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(
																						_gdotdesign$elm_ui$Ui_Css_Properties$px(34)),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
																							_gdotdesign$elm_ui$Ui_Css_Properties$px(34)),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$margin(
																								_gdotdesign$elm_ui$Ui_Css_Properties$px(4)),
																							_1: {
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$flex),
																								_1: {
																									ctor: '::',
																									_0: A2(
																										_gdotdesign$elm_ui$Ui_Css$selector,
																										'&[inactive]',
																										{
																											ctor: '::',
																											_0: _gdotdesign$elm_ui$Ui_Css_Properties$opacity(0.25),
																											_1: {ctor: '[]'}
																										}),
																									_1: {
																										ctor: '::',
																										_0: A2(
																											_gdotdesign$elm_ui$Ui_Css$selector,
																											'&:not(:empty)',
																											{
																												ctor: '::',
																												_0: _gdotdesign$elm_ui$Ui_Css_Properties$backgroundColor(theme.colors.inputSecondary.color),
																												_1: {
																													ctor: '::',
																													_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.inputSecondary.bw),
																													_1: {ctor: '[]'}
																												}
																											}),
																										_1: {ctor: '[]'}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_gdotdesign$elm_ui$Ui_Css$selector,
																		'&:not([disabled])[selectable] ui-calendar-cell',
																		{
																			ctor: '::',
																			_0: A2(
																				_gdotdesign$elm_ui$Ui_Css$selectors,
																				{
																					ctor: '::',
																					_0: '&:not([inactive]):hover',
																					_1: {
																						ctor: '::',
																						_0: '&[selected]',
																						_1: {ctor: '[]'}
																					}
																				},
																				{
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$backgroundColor(theme.colors.primary.color),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.primary.bw),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$fontWeight(_gdotdesign$elm_ui$Ui_Css_Properties$bold),
																							_1: {
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$cursor(_gdotdesign$elm_ui$Ui_Css_Properties$pointer),
																								_1: {ctor: '[]'}
																							}
																						}
																					}
																				}),
																			_1: {ctor: '[]'}
																		}),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_gdotdesign$elm_ui$Ui_Css$selector,
																			'&[readonly]',
																			{
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$readonly,
																				_1: {
																					ctor: '::',
																					_0: A2(
																						_gdotdesign$elm_ui$Ui_Css$selector,
																						'> *',
																						{
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$pointerEvents(_gdotdesign$elm_ui$Ui_Css_Properties$none),
																							_1: {ctor: '[]'}
																						}),
																					_1: {
																						ctor: '::',
																						_0: A2(
																							_gdotdesign$elm_ui$Ui_Css$selector,
																							'svg',
																							{
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$none),
																								_1: {ctor: '[]'}
																							}),
																						_1: {ctor: '[]'}
																					}
																				}
																			}),
																		_1: {
																			ctor: '::',
																			_0: A2(
																				_gdotdesign$elm_ui$Ui_Css$selector,
																				'&[disabled]',
																				{
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$disabled,
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$backgroundColor(theme.colors.disabled.color),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.disabled.bw),
																							_1: {
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderColor(_gdotdesign$elm_ui$Ui_Css_Properties$transparent),
																								_1: {
																									ctor: '::',
																									_0: A2(
																										_gdotdesign$elm_ui$Ui_Css$selectors,
																										{
																											ctor: '::',
																											_0: '> ui-container',
																											_1: {
																												ctor: '::',
																												_0: 'ui-calendar-header',
																												_1: {ctor: '[]'}
																											}
																										},
																										{
																											ctor: '::',
																											_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderBottom(
																												A2(
																													_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																													A2(
																														_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																														_gdotdesign$elm_ui$Ui_Css_Properties$px(1),
																														_gdotdesign$elm_ui$Ui_Css_Properties$dashed),
																													theme.colors.borderDisabled)),
																											_1: {ctor: '[]'}
																										}),
																									_1: {
																										ctor: '::',
																										_0: A2(
																											_gdotdesign$elm_ui$Ui_Css$selector,
																											'> *',
																											{
																												ctor: '::',
																												_0: _gdotdesign$elm_ui$Ui_Css_Properties$pointerEvents(_gdotdesign$elm_ui$Ui_Css_Properties$none),
																												_1: {ctor: '[]'}
																											}),
																										_1: {
																											ctor: '::',
																											_0: A2(
																												_gdotdesign$elm_ui$Ui_Css$selector,
																												'ui-calendar-cell',
																												{
																													ctor: '::',
																													_0: A2(
																														_gdotdesign$elm_ui$Ui_Css$selector,
																														'&:not(:empty)',
																														{
																															ctor: '::',
																															_0: _gdotdesign$elm_ui$Ui_Css_Properties$backgroundColor(theme.colors.disabledSecondary.color),
																															_1: {
																																ctor: '::',
																																_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.disabledSecondary.bw),
																																_1: {
																																	ctor: '::',
																																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$opacity(0.5),
																																	_1: {ctor: '[]'}
																																}
																															}
																														}),
																													_1: {
																														ctor: '::',
																														_0: A2(
																															_gdotdesign$elm_ui$Ui_Css$selector,
																															'&[selected]',
																															{
																																ctor: '::',
																																_0: _gdotdesign$elm_ui$Ui_Css_Properties$opacity(1),
																																_1: {ctor: '[]'}
																															}),
																														_1: {ctor: '[]'}
																													}
																												}),
																											_1: {ctor: '[]'}
																										}
																									}
																								}
																							}
																						}
																					}
																				}),
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Calendar$defaultStyle = _gdotdesign$elm_ui$Ui_Styles$attributes(
	_gdotdesign$elm_ui$Ui_Styles_Calendar$style(_gdotdesign$elm_ui$Ui_Styles_Theme$default));

var _gdotdesign$elm_ui$Ui_Calendar$dayNames = function (locale) {
	var config = function (_) {
		return _.i18n;
	}(
		_rluiten$elm_date_extra$Date_Extra_Config_Configs$getConfig(locale));
	return A2(
		_elm_lang$core$List$map,
		config.dayShort,
		{
			ctor: '::',
			_0: _elm_lang$core$Date$Mon,
			_1: {
				ctor: '::',
				_0: _elm_lang$core$Date$Tue,
				_1: {
					ctor: '::',
					_0: _elm_lang$core$Date$Wed,
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Date$Thu,
						_1: {
							ctor: '::',
							_0: _elm_lang$core$Date$Fri,
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Date$Sat,
								_1: {
									ctor: '::',
									_0: _elm_lang$core$Date$Sun,
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Calendar$paddingLeft = function (date) {
	var _p0 = _elm_lang$core$Date$dayOfWeek(date);
	switch (_p0.ctor) {
		case 'Mon':
			return 0;
		case 'Tue':
			return 1;
		case 'Wed':
			return 2;
		case 'Thu':
			return 3;
		case 'Fri':
			return 4;
		case 'Sat':
			return 5;
		default:
			return 6;
	}
};
var _gdotdesign$elm_ui$Ui_Calendar$fixDate = function (model) {
	return A2(_gdotdesign$elm_ui$Ext_Date$isSameMonth, model.date, model.value) ? model : _elm_lang$core$Native_Utils.update(
		model,
		{date: model.value});
};
var _gdotdesign$elm_ui$Ui_Calendar$previousDay = function (model) {
	return _gdotdesign$elm_ui$Ui_Calendar$fixDate(
		_elm_lang$core$Native_Utils.update(
			model,
			{
				value: _gdotdesign$elm_ui$Ext_Date$previousDay(model.value)
			}));
};
var _gdotdesign$elm_ui$Ui_Calendar$nextDay = function (model) {
	return _gdotdesign$elm_ui$Ui_Calendar$fixDate(
		_elm_lang$core$Native_Utils.update(
			model,
			{
				value: _gdotdesign$elm_ui$Ext_Date$nextDay(model.value)
			}));
};
var _gdotdesign$elm_ui$Ui_Calendar$setValue = F2(
	function (date, model) {
		return _gdotdesign$elm_ui$Ui_Calendar$fixDate(
			_elm_lang$core$Native_Utils.update(
				model,
				{value: date}));
	});
var _gdotdesign$elm_ui$Ui_Calendar$update = F2(
	function (msg, model) {
		var _p1 = msg;
		switch (_p1.ctor) {
			case 'PreviousMonth':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							date: _gdotdesign$elm_ui$Ext_Date$previousMonth(model.date)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'NextMonth':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							date: _gdotdesign$elm_ui$Ext_Date$nextMonth(model.date)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				var _p2 = _p1._0;
				return A2(_gdotdesign$elm_ui$Ext_Date$isSameDate, model.value, _p2) ? {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none} : {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{value: _p2}),
					_1: A2(
						_gdotdesign$elm_ui$Ui_Helpers_Emitter$sendFloat,
						model.uid,
						_elm_lang$core$Date$toTime(_p2))
				};
		}
	});
var _gdotdesign$elm_ui$Ui_Calendar$onChange = F2(
	function (msg, model) {
		return A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$listenFloat, model.uid, msg);
	});
var _gdotdesign$elm_ui$Ui_Calendar$selectable = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{selectable: value});
	});
var _gdotdesign$elm_ui$Ui_Calendar$init = function (_p3) {
	return {
		value: _gdotdesign$elm_ui$Ext_Date$now(
			{ctor: '_Tuple0'}),
		date: _gdotdesign$elm_ui$Ext_Date$now(
			{ctor: '_Tuple0'}),
		selectable: true,
		disabled: false,
		readonly: false,
		uid: _gdotdesign$elm_ui$Ui_Native_Uid$uid(
			{ctor: '_Tuple0'})
	};
};
var _gdotdesign$elm_ui$Ui_Calendar$Model = F6(
	function (a, b, c, d, e, f) {
		return {selectable: a, value: b, date: c, disabled: d, readonly: e, uid: f};
	});
var _gdotdesign$elm_ui$Ui_Calendar$NextMonth = {ctor: 'NextMonth'};
var _gdotdesign$elm_ui$Ui_Calendar$PreviousMonth = {ctor: 'PreviousMonth'};
var _gdotdesign$elm_ui$Ui_Calendar$Select = function (a) {
	return {ctor: 'Select', _0: a};
};
var _gdotdesign$elm_ui$Ui_Calendar$renderCell = F2(
	function (model, date) {
		var value = model.selectable && A2(_gdotdesign$elm_ui$Ext_Date$isSameDate, date, model.value);
		var sameMonth = A2(_gdotdesign$elm_ui$Ext_Date$isSameMonth, date, model.date);
		var click = ((!model.disabled) && ((!model.readonly) && (model.selectable && sameMonth))) ? {
			ctor: '::',
			_0: _elm_lang$html$Html_Events$onClick(
				_gdotdesign$elm_ui$Ui_Calendar$Select(date)),
			_1: {ctor: '[]'}
		} : {ctor: '[]'};
		var attributes = _gdotdesign$elm_ui$Ui$attributeList(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'inactive', _1: !sameMonth},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'selected', _1: value},
					_1: {ctor: '[]'}
				}
			});
		return A3(
			_elm_lang$html$Html$node,
			'ui-calendar-cell',
			A2(_elm_lang$core$Basics_ops['++'], attributes, click),
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(
						_elm_lang$core$Date$day(date))),
				_1: {ctor: '[]'}
			});
	});
var _gdotdesign$elm_ui$Ui_Calendar$render = F2(
	function (locale, model) {
		var previousAction = A2(
			_gdotdesign$elm_ui$Ui$enabledActions,
			model,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(_gdotdesign$elm_ui$Ui_Calendar$PreviousMonth),
				_1: {ctor: '[]'}
			});
		var nextAction = A2(
			_gdotdesign$elm_ui$Ui$enabledActions,
			model,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(_gdotdesign$elm_ui$Ui_Calendar$NextMonth),
				_1: {ctor: '[]'}
			});
		var month = _gdotdesign$elm_ui$Ext_Date$begginingOfMonth(model.date);
		var dates = _gdotdesign$elm_ui$Ext_Date$datesInMonth(month);
		var leftPadding = _gdotdesign$elm_ui$Ui_Calendar$paddingLeft(month);
		var paddingLeftItems = _elm_lang$core$List$reverse(
			A2(
				_elm_lang$core$List$take,
				_gdotdesign$elm_ui$Ui_Calendar$paddingLeft(month),
				_elm_lang$core$List$reverse(
					_gdotdesign$elm_ui$Ext_Date$datesInMonth(
						_gdotdesign$elm_ui$Ext_Date$previousMonth(month)))));
		var paddingRightItems = A2(
			_elm_lang$core$List$take,
			(42 - leftPadding) - _elm_lang$core$List$length(dates),
			_gdotdesign$elm_ui$Ext_Date$datesInMonth(
				_gdotdesign$elm_ui$Ext_Date$nextMonth(month)));
		var cells = A2(
			_elm_lang$core$List$map,
			_gdotdesign$elm_ui$Ui_Calendar$renderCell(model),
			A2(
				_elm_lang$core$Basics_ops['++'],
				paddingLeftItems,
				A2(_elm_lang$core$Basics_ops['++'], dates, paddingRightItems)));
		var container = A3(
			_gdotdesign$elm_ui$Ui_Container$view,
			{compact: true, align: 'stretch', direction: 'row'},
			{ctor: '[]'},
			{
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Icons$chevronLeft(previousAction),
				_1: {
					ctor: '::',
					_0: A3(
						_elm_lang$html$Html$node,
						'div',
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(
								A3(
									_rluiten$elm_date_extra$Date_Extra_Format$format,
									_rluiten$elm_date_extra$Date_Extra_Config_Configs$getConfig(locale),
									'%Y - %B',
									month)),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Icons$chevronRight(nextAction),
						_1: {ctor: '[]'}
					}
				}
			});
		return A3(
			_elm_lang$html$Html$node,
			'ui-calendar',
			_elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui$attributeList(
						{
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'selectable', _1: model.selectable},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'disabled', _1: model.disabled},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'readonly', _1: model.readonly},
									_1: {ctor: '[]'}
								}
							}
						}),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Styles$apply(_gdotdesign$elm_ui$Ui_Styles_Calendar$defaultStyle),
						_1: {ctor: '[]'}
					}
				}),
			{
				ctor: '::',
				_0: container,
				_1: {
					ctor: '::',
					_0: A3(
						_elm_lang$html$Html$node,
						'ui-calendar-header',
						{ctor: '[]'},
						A2(
							_elm_lang$core$List$map,
							function (item) {
								return A2(
									_elm_lang$html$Html$span,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(item),
										_1: {ctor: '[]'}
									});
							},
							_gdotdesign$elm_ui$Ui_Calendar$dayNames(locale))),
					_1: {
						ctor: '::',
						_0: A3(
							_elm_lang$html$Html$node,
							'ui-calendar-table',
							{ctor: '[]'},
							cells),
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _gdotdesign$elm_ui$Ui_Calendar$view = F2(
	function (locale, model) {
		return A3(_elm_lang$html$Html_Lazy$lazy2, _gdotdesign$elm_ui$Ui_Calendar$render, locale, model);
	});

var _gdotdesign$elm_ui$Ui_Helpers_Intendable$select = F2(
	function (item, fallback) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			A2(_elm_lang$core$Maybe$withDefault, '', fallback),
			item);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Intendable$previousItem = F2(
	function (_p0, fallback) {
		var _p1 = _p0;
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Intendable$select,
			_elm_community$list_extra$List_Extra$last(_p1._0),
			fallback);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Intendable$index = F2(
	function (value, list) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			-1,
			A2(
				_elm_community$list_extra$List_Extra$findIndex,
				function (item) {
					return _elm_lang$core$Native_Utils.eq(item, value);
				},
				list));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Intendable$previous = F2(
	function (value, list) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Intendable$previousItem,
			A2(
				_elm_community$list_extra$List_Extra$splitAt,
				A2(_gdotdesign$elm_ui$Ui_Helpers_Intendable$index, value, list),
				list),
			_elm_community$list_extra$List_Extra$last(list));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Intendable$first = function (list) {
	return A2(
		_elm_community$list_extra$List_Extra$find,
		function (_p2) {
			return true;
		},
		list);
};
var _gdotdesign$elm_ui$Ui_Helpers_Intendable$nextItem = F2(
	function (_p3, fallback) {
		var _p4 = _p3;
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Intendable$select,
			_gdotdesign$elm_ui$Ui_Helpers_Intendable$first(_p4._1),
			fallback);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Intendable$next = F2(
	function (value, list) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Intendable$nextItem,
			A2(
				_elm_community$list_extra$List_Extra$splitAt,
				A2(_gdotdesign$elm_ui$Ui_Helpers_Intendable$index, value, list) + 1,
				list),
			_gdotdesign$elm_ui$Ui_Helpers_Intendable$first(list));
	});

var _gdotdesign$elm_ui$Ui_Styles_Dropdown$style = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Css_Properties$border(
				A2(
					_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
					A2(
						_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
						_gdotdesign$elm_ui$Ui_Css_Properties$px(1),
						_gdotdesign$elm_ui$Ui_Css_Properties$solid),
					theme.colors.border)),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$backgroundColor(theme.colors.input.color),
				_1: {
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderRadius(theme.borderRadius),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Css_Properties$fontFamily(theme.fontFamily),
						_1: {
							ctor: '::',
							_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.input.bw),
							_1: {
								ctor: '::',
								_0: _gdotdesign$elm_ui$Ui_Css_Properties$zIndex(theme.zIndexes.dropdown),
								_1: {
									ctor: '::',
									_0: _gdotdesign$elm_ui$Ui_Css_Properties$pointerEvents(_gdotdesign$elm_ui$Ui_Css_Properties$none),
									_1: {
										ctor: '::',
										_0: _gdotdesign$elm_ui$Ui_Css_Properties$visibility(_gdotdesign$elm_ui$Ui_Css_Properties$hidden),
										_1: {
											ctor: '::',
											_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$fixed),
											_1: {
												ctor: '::',
												_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$block),
												_1: {
													ctor: '::',
													_0: _gdotdesign$elm_ui$Ui_Css_Properties$opacity(0),
													_1: {
														ctor: '::',
														_0: _gdotdesign$elm_ui$Ui_Css_Properties$boxShadow(
															{
																ctor: '::',
																_0: {
																	color: 'rgba(0,0,0,0.1)',
																	blur: _gdotdesign$elm_ui$Ui_Css_Properties$px(20),
																	inset: false,
																	spread: _gdotdesign$elm_ui$Ui_Css_Properties$zero,
																	y: _gdotdesign$elm_ui$Ui_Css_Properties$px(5),
																	x: _gdotdesign$elm_ui$Ui_Css_Properties$zero
																},
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: _gdotdesign$elm_ui$Ui_Css_Properties$transform(
																{
																	ctor: '::',
																	_0: A3(_gdotdesign$elm_ui$Ui_Css_Properties$translate3d, _gdotdesign$elm_ui$Ui_Css_Properties$zero, _gdotdesign$elm_ui$Ui_Css_Properties$zero, _gdotdesign$elm_ui$Ui_Css_Properties$zero),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$translateY(
																			_gdotdesign$elm_ui$Ui_Css_Properties$px(10)),
																		_1: {ctor: '[]'}
																	}
																}),
															_1: {
																ctor: '::',
																_0: _gdotdesign$elm_ui$Ui_Css_Properties$transition(
																	{
																		ctor: '::',
																		_0: {
																			property: 'opacity',
																			duration: _gdotdesign$elm_ui$Ui_Css_Properties$ms(150),
																			easing: 'ease',
																			delay: _gdotdesign$elm_ui$Ui_Css_Properties$ms(0)
																		},
																		_1: {
																			ctor: '::',
																			_0: {
																				property: 'transform',
																				duration: _gdotdesign$elm_ui$Ui_Css_Properties$ms(150),
																				easing: 'ease',
																				delay: _gdotdesign$elm_ui$Ui_Css_Properties$ms(0)
																			},
																			_1: {
																				ctor: '::',
																				_0: {
																					property: 'visibility',
																					duration: _gdotdesign$elm_ui$Ui_Css_Properties$ms(1),
																					delay: _gdotdesign$elm_ui$Ui_Css_Properties$ms(150),
																					easing: 'ease'
																				},
																				_1: {ctor: '[]'}
																			}
																		}
																	}),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_gdotdesign$elm_ui$Ui_Css$selector,
																		'&[open]',
																		{
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$pointerEvents(_gdotdesign$elm_ui$Ui_Css_Properties$auto),
																			_1: {
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$visibility(_gdotdesign$elm_ui$Ui_Css_Properties$visible),
																				_1: {
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$opacity(1),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$transform(
																							{
																								ctor: '::',
																								_0: A3(_gdotdesign$elm_ui$Ui_Css_Properties$translate3d, _gdotdesign$elm_ui$Ui_Css_Properties$zero, _gdotdesign$elm_ui$Ui_Css_Properties$zero, _gdotdesign$elm_ui$Ui_Css_Properties$zero),
																								_1: {
																									ctor: '::',
																									_0: _gdotdesign$elm_ui$Ui_Css_Properties$translateY(_gdotdesign$elm_ui$Ui_Css_Properties$zero),
																									_1: {ctor: '[]'}
																								}
																							}),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$transition(
																								{
																									ctor: '::',
																									_0: {
																										property: 'opacity',
																										duration: _gdotdesign$elm_ui$Ui_Css_Properties$ms(150),
																										easing: 'ease',
																										delay: _gdotdesign$elm_ui$Ui_Css_Properties$ms(0)
																									},
																									_1: {
																										ctor: '::',
																										_0: {
																											property: 'transform',
																											duration: _gdotdesign$elm_ui$Ui_Css_Properties$ms(150),
																											easing: 'ease',
																											delay: _gdotdesign$elm_ui$Ui_Css_Properties$ms(0)
																										},
																										_1: {
																											ctor: '::',
																											_0: {
																												property: 'visibility',
																												duration: _gdotdesign$elm_ui$Ui_Css_Properties$ms(1),
																												easing: 'ease',
																												delay: _gdotdesign$elm_ui$Ui_Css_Properties$ms(0)
																											},
																											_1: {ctor: '[]'}
																										}
																									}
																								}),
																							_1: {ctor: '[]'}
																						}
																					}
																				}
																			}
																		}),
																	_1: {ctor: '[]'}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Dropdown$defaultStyle = _gdotdesign$elm_ui$Ui_Styles$attributes(
	_gdotdesign$elm_ui$Ui_Styles_Dropdown$style(_gdotdesign$elm_ui$Ui_Styles_Theme$default));

var _gdotdesign$elm_ui$Ui_Native_Scrolls$onSelfMsg = F3(
	function (router, msg, state) {
		var send = function (msg) {
			var _p0 = msg;
			return A2(_elm_lang$core$Platform$sendToApp, router, _p0._0);
		};
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p1) {
				return _elm_lang$core$Task$succeed(state);
			},
			_elm_lang$core$Task$sequence(
				A2(_elm_lang$core$List$map, send, state.subs)));
	});
var _gdotdesign$elm_ui$Ui_Native_Scrolls$init = _elm_lang$core$Task$succeed(
	{
		subs: {ctor: '[]'},
		pid: _elm_lang$core$Maybe$Nothing
	});
var _gdotdesign$elm_ui$Ui_Native_Scrolls$subscription = _elm_lang$core$Native_Platform.leaf('Ui.Native.Scrolls');
var _gdotdesign$elm_ui$Ui_Native_Scrolls$State = F2(
	function (a, b) {
		return {subs: a, pid: b};
	});
var _gdotdesign$elm_ui$Ui_Native_Scrolls$MySub = function (a) {
	return {ctor: 'MySub', _0: a};
};
var _gdotdesign$elm_ui$Ui_Native_Scrolls$scrolls = function (msg) {
	return _gdotdesign$elm_ui$Ui_Native_Scrolls$subscription(
		_gdotdesign$elm_ui$Ui_Native_Scrolls$MySub(msg));
};
var _gdotdesign$elm_ui$Ui_Native_Scrolls$subMap = F2(
	function (func, _p2) {
		var _p3 = _p2;
		return _gdotdesign$elm_ui$Ui_Native_Scrolls$MySub(
			func(_p3._0));
	});
var _gdotdesign$elm_ui$Ui_Native_Scrolls$Msg = {ctor: 'Msg'};
var _gdotdesign$elm_ui$Ui_Native_Scrolls$onEffects = F3(
	function (router, newSubs, oldState) {
		var state = {
			ctor: '_Tuple2',
			_0: oldState.pid,
			_1: !_elm_lang$core$List$isEmpty(newSubs)
		};
		var _p4 = state;
		if (_p4._0.ctor === 'Just') {
			if (_p4._1 === true) {
				return _elm_lang$core$Task$succeed(
					_elm_lang$core$Native_Utils.update(
						oldState,
						{subs: newSubs}));
			} else {
				return A2(
					_elm_lang$core$Task$andThen,
					function (_p5) {
						return _elm_lang$core$Task$succeed(
							_elm_lang$core$Native_Utils.update(
								oldState,
								{
									subs: {ctor: '[]'},
									pid: _elm_lang$core$Maybe$Nothing
								}));
					},
					_elm_lang$core$Process$kill(_p4._0._0));
			}
		} else {
			if (_p4._1 === true) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (pid) {
						return _elm_lang$core$Task$succeed(
							{
								pid: _elm_lang$core$Maybe$Just(pid),
								subs: newSubs
							});
					},
					_elm_lang$core$Process$spawn(
						A3(
							_elm_lang$dom$Dom_LowLevel$onWindow,
							'scroll',
							_elm_lang$core$Json_Decode$succeed(''),
							function (_p6) {
								return A2(_elm_lang$core$Platform$sendToSelf, router, _gdotdesign$elm_ui$Ui_Native_Scrolls$Msg);
							})));
			} else {
				return _elm_lang$core$Task$succeed(oldState);
			}
		}
	});
_elm_lang$core$Native_Platform.effectManagers['Ui.Native.Scrolls'] = {pkg: 'gdotdesign/elm-ui', init: _gdotdesign$elm_ui$Ui_Native_Scrolls$init, onEffects: _gdotdesign$elm_ui$Ui_Native_Scrolls$onEffects, onSelfMsg: _gdotdesign$elm_ui$Ui_Native_Scrolls$onSelfMsg, tag: 'sub', subMap: _gdotdesign$elm_ui$Ui_Native_Scrolls$subMap};

var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$decideSide = F5(
	function (side, positiveOptimal, negativeOptimal, bound, size) {
		var _p0 = side;
		if (_p0.ctor === 'Positive') {
			return (_elm_lang$core$Native_Utils.cmp(positiveOptimal + size, bound) > 0) ? negativeOptimal : positiveOptimal;
		} else {
			return (_elm_lang$core$Native_Utils.cmp(negativeOptimal, 0) < 0) ? positiveOptimal : negativeOptimal;
		}
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$favored = F5(
	function (model, high, low, bound, size) {
		var negativeOptimal = (high - size) - model.offset;
		var positiveOptimal = low + model.offset;
		return A5(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$decideSide, model.favoring, positiveOptimal, negativeOptimal, bound, size);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$align = F5(
	function (model, high, low, bound, size) {
		var negativeOptimal = low - size;
		var positiveOptimal = high;
		return A5(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$decideSide, model.alignTo, positiveOptimal, negativeOptimal, bound, size);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$calculateLeft = F4(
	function (window, parent, dropdown, model) {
		var optimal = function () {
			var _p1 = model.direction;
			if (_p1.ctor === 'Horizontal') {
				return A5(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$favored, model, parent.left, parent.right, window.width, dropdown.width);
			} else {
				return A5(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$align, model, parent.left, parent.right, window.width, dropdown.width);
			}
		}();
		var maxiumum = window.width - dropdown.width;
		return A2(_elm_lang$core$Basics$min, maxiumum, optimal);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$calculateTop = F4(
	function (window, parent, dropdown, model) {
		var optimal = function () {
			var _p2 = model.direction;
			if (_p2.ctor === 'Horizontal') {
				return A5(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$align, model, parent.top, parent.bottom, window.height, dropdown.height);
			} else {
				return A5(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$favored, model, parent.top, parent.bottom, window.height, dropdown.height);
			}
		}();
		var maxiumum = window.height - dropdown.height;
		return A2(_elm_lang$core$Basics$min, maxiumum, optimal);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$defaultRect = {top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$openDropdown = F2(
	function (uid, model) {
		var dropdown = A2(
			_elm_lang$core$Result$withDefault,
			_gdotdesign$elm_ui$Ui_Helpers_Dropdown$defaultRect,
			_gdotdesign$elm_dom$DOM$getDimensionsSync(
				_gdotdesign$elm_dom$DOM$idSelector(
					A2(_elm_lang$core$Basics_ops['++'], uid, '-dropdown'))));
		var parent = A2(
			_elm_lang$core$Result$withDefault,
			_gdotdesign$elm_ui$Ui_Helpers_Dropdown$defaultRect,
			_gdotdesign$elm_dom$DOM$getDimensionsSync(
				_gdotdesign$elm_dom$DOM$idSelector(uid)));
		var window = {
			height: _gdotdesign$elm_dom$DOM_Window$height(
				{ctor: '_Tuple0'}),
			width: _gdotdesign$elm_dom$DOM_Window$width(
				{ctor: '_Tuple0'})
		};
		return _elm_lang$core$Native_Utils.update(
			model,
			{
				left: A4(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$calculateLeft, window, parent, dropdown, model),
				top: A4(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$calculateTop, window, parent, dropdown, model),
				open: true
			});
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$updateDropdown = F2(
	function ($function, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{
				dropdown: $function(model.dropdown)
			});
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$isOver = F2(
	function (id, position) {
		return A2(
			_elm_lang$core$Result$withDefault,
			false,
			A2(
				_gdotdesign$elm_dom$DOM$isOver,
				_gdotdesign$elm_dom$DOM$idSelector(id),
				{
					top: _elm_lang$core$Basics$toFloat(position.y),
					left: _elm_lang$core$Basics$toFloat(position.x)
				}));
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$render = F2(
	function (viewModel, model) {
		var dropdown = A3(
			_elm_lang$html$Html$node,
			'ui-dropdown-panel',
			_elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui$attributeList(
						{
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'open', _1: model.dropdown.open},
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$id(
								A2(_elm_lang$core$Basics_ops['++'], model.uid, '-dropdown')),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$style(
									{
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'left',
											_1: A2(
												_elm_lang$core$Basics_ops['++'],
												_elm_lang$core$Basics$toString(model.dropdown.left),
												'px')
										},
										_1: {
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'top',
												_1: A2(
													_elm_lang$core$Basics_ops['++'],
													_elm_lang$core$Basics$toString(model.dropdown.top),
													'px')
											},
											_1: {ctor: '[]'}
										}
									}),
								_1: {ctor: '[]'}
							}
						},
						_1: {
							ctor: '::',
							_0: _gdotdesign$elm_ui$Ui_Styles$apply(_gdotdesign$elm_ui$Ui_Styles_Dropdown$defaultStyle),
							_1: {ctor: '[]'}
						}
					}
				}),
			viewModel.contents);
		var children = A2(
			_elm_lang$core$Basics_ops['++'],
			viewModel.children,
			{
				ctor: '::',
				_0: dropdown,
				_1: {ctor: '[]'}
			});
		var attributes = A2(
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			viewModel.attributes,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$id(model.uid),
				_1: {ctor: '[]'}
			});
		return A3(_elm_lang$html$Html$node, viewModel.tag, attributes, children);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$view = F2(
	function (viewModel, model) {
		return A3(_elm_lang$html$Html_Lazy$lazy2, _gdotdesign$elm_ui$Ui_Helpers_Dropdown$render, viewModel, model);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$close = function (model) {
	return A2(
		_gdotdesign$elm_ui$Ui_Helpers_Dropdown$updateDropdown,
		function (dropdown) {
			return _elm_lang$core$Native_Utils.update(
				dropdown,
				{open: false});
		},
		model);
};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$update = F2(
	function (msg, model) {
		var _p3 = msg;
		if (_p3.ctor === 'Click') {
			return A2(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$isOver, model.uid, _p3._0) ? model : _gdotdesign$elm_ui$Ui_Helpers_Dropdown$close(model);
		} else {
			return _gdotdesign$elm_ui$Ui_Helpers_Dropdown$close(model);
		}
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$open = function (model) {
	return A2(
		_gdotdesign$elm_ui$Ui_Helpers_Dropdown$updateDropdown,
		function (dropdown) {
			return A2(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$openDropdown, model.uid, dropdown);
		},
		model);
};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$toggle = function (model) {
	return model.dropdown.open ? _gdotdesign$elm_ui$Ui_Helpers_Dropdown$close(model) : _gdotdesign$elm_ui$Ui_Helpers_Dropdown$open(model);
};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$offset = F2(
	function (offset, model) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Dropdown$updateDropdown,
			function (dropdown) {
				return _elm_lang$core$Native_Utils.update(
					dropdown,
					{offset: offset});
			},
			model);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$direction = F2(
	function (value, model) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Dropdown$updateDropdown,
			function (dropdown) {
				return _elm_lang$core$Native_Utils.update(
					dropdown,
					{direction: value});
			},
			model);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$ViewModel = F5(
	function (a, b, c, d, e) {
		return {attributes: a, children: b, contents: c, address: d, tag: e};
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Dropdown = F7(
	function (a, b, c, d, e, f, g) {
		return {direction: a, favoring: b, alignTo: c, offset: d, left: e, top: f, open: g};
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Vertical = {ctor: 'Vertical'};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Horizontal = {ctor: 'Horizontal'};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Top = {ctor: 'Top'};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Left = {ctor: 'Left'};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Right = {ctor: 'Right'};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Bottom = {ctor: 'Bottom'};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Negative = {ctor: 'Negative'};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Positive = {ctor: 'Positive'};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$init = {direction: _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Vertical, favoring: _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Positive, alignTo: _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Positive, open: false, offset: 0, left: 0, top: 0};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$getSpaceFromSide = function (side) {
	var _p4 = side;
	switch (_p4.ctor) {
		case 'Bottom':
			return _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Positive;
		case 'Right':
			return _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Positive;
		case 'Left':
			return _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Negative;
		default:
			return _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Negative;
	}
};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$favoring = F2(
	function (side, model) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Dropdown$updateDropdown,
			function (dropdown) {
				return _elm_lang$core$Native_Utils.update(
					dropdown,
					{
						favoring: _gdotdesign$elm_ui$Ui_Helpers_Dropdown$getSpaceFromSide(side)
					});
			},
			model);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$stwitchSpace = function (space) {
	var _p5 = space;
	if (_p5.ctor === 'Positive') {
		return _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Negative;
	} else {
		return _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Positive;
	}
};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$alignTo = F2(
	function (side, model) {
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Dropdown$updateDropdown,
			function (dropdown) {
				return _elm_lang$core$Native_Utils.update(
					dropdown,
					{
						alignTo: _gdotdesign$elm_ui$Ui_Helpers_Dropdown$stwitchSpace(
							_gdotdesign$elm_ui$Ui_Helpers_Dropdown$getSpaceFromSide(side))
					});
			},
			model);
	});
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Close = {ctor: 'Close'};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$Click = function (a) {
	return {ctor: 'Click', _0: a};
};
var _gdotdesign$elm_ui$Ui_Helpers_Dropdown$subscriptions = function (model) {
	return model.dropdown.open ? _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: _elm_lang$window$Window$resizes(
				_elm_lang$core$Basics$always(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$Close)),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Native_Scrolls$scrolls(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$Close),
				_1: {
					ctor: '::',
					_0: _elm_lang$mouse$Mouse$downs(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$Click),
					_1: {ctor: '[]'}
				}
			}
		}) : _elm_lang$core$Platform_Sub$none;
};

var _gdotdesign$elm_ui$Ui_Styles_ScrolledPanel$style = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Css_Properties$maxHeight(_gdotdesign$elm_ui$Ui_Css_Properties$inherit),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$relative),
				_1: {
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(_gdotdesign$elm_ui$Ui_Css_Properties$inherit),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$flex),
						_1: {
							ctor: '::',
							_0: _gdotdesign$elm_ui$Ui_Css_Properties$flex_('1'),
							_1: {
								ctor: '::',
								_0: A2(
									_gdotdesign$elm_ui$Ui_Css$selector,
									'ui-scrolled-panel-wrapper',
									{
										ctor: '::',
										_0: _gdotdesign$elm_ui$Ui_Css_Properties$paddingRight(
											_gdotdesign$elm_ui$Ui_Css_Properties$px(5)),
										_1: {
											ctor: '::',
											_0: _gdotdesign$elm_ui$Ui_Css_Properties$maxHeight(_gdotdesign$elm_ui$Ui_Css_Properties$inherit),
											_1: {
												ctor: '::',
												_0: _gdotdesign$elm_ui$Ui_Css_Properties$overflowY(_gdotdesign$elm_ui$Ui_Css_Properties$scroll),
												_1: {
													ctor: '::',
													_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(_gdotdesign$elm_ui$Ui_Css_Properties$inherit),
													_1: {
														ctor: '::',
														_0: _gdotdesign$elm_ui$Ui_Css_Properties$flex_('1'),
														_1: {
															ctor: '::',
															_0: A2(
																_gdotdesign$elm_ui$Ui_Css$selector,
																'&::-webkit-scrollbar',
																{
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(
																		_gdotdesign$elm_ui$Ui_Css_Properties$px(10)),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
																			_gdotdesign$elm_ui$Ui_Css_Properties$px(10)),
																		_1: {ctor: '[]'}
																	}
																}),
															_1: {
																ctor: '::',
																_0: A2(
																	_gdotdesign$elm_ui$Ui_Css$selector,
																	'&::-webkit-scrollbar-button',
																	{
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(_gdotdesign$elm_ui$Ui_Css_Properties$zero),
																		_1: {
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(_gdotdesign$elm_ui$Ui_Css_Properties$zero),
																			_1: {ctor: '[]'}
																		}
																	}),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_gdotdesign$elm_ui$Ui_Css$selector,
																		'&::-webkit-scrollbar-thumb',
																		{
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.scrollbar.thumbColor),
																			_1: {
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderRadius(theme.borderRadius),
																				_1: {
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$border(_gdotdesign$elm_ui$Ui_Css_Properties$zero),
																					_1: {ctor: '[]'}
																				}
																			}
																		}),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_gdotdesign$elm_ui$Ui_Css$selector,
																			'&::-webkit-scrollbar-thumb:hover',
																			{
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.scrollbar.thumbHoverColor),
																				_1: {ctor: '[]'}
																			}),
																		_1: {
																			ctor: '::',
																			_0: A2(
																				_gdotdesign$elm_ui$Ui_Css$selector,
																				'&::-webkit-scrollbar-track',
																				{
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.scrollbar.trackColor),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderRadius(theme.borderRadius),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$border(_gdotdesign$elm_ui$Ui_Css_Properties$zero),
																							_1: {ctor: '[]'}
																						}
																					}
																				}),
																			_1: {
																				ctor: '::',
																				_0: A2(
																					_gdotdesign$elm_ui$Ui_Css$selector,
																					'&::-webkit-scrollbar-corner',
																					{
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(_gdotdesign$elm_ui$Ui_Css_Properties$transparent),
																						_1: {ctor: '[]'}
																					}),
																				_1: {ctor: '[]'}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}),
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_ScrolledPanel$defaultStyle = _gdotdesign$elm_ui$Ui_Styles$attributes(
	_gdotdesign$elm_ui$Ui_Styles_ScrolledPanel$style(_gdotdesign$elm_ui$Ui_Styles_Theme$default));

var _gdotdesign$elm_ui$Ui_ScrolledPanel$view = F2(
	function (attributes, contents) {
		return A3(
			_elm_lang$html$Html$node,
			'ui-scrolled-panel',
			_elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Styles$apply(_gdotdesign$elm_ui$Ui_Styles_ScrolledPanel$defaultStyle),
					_1: {
						ctor: '::',
						_0: attributes,
						_1: {ctor: '[]'}
					}
				}),
			{
				ctor: '::',
				_0: A3(
					_elm_lang$html$Html$node,
					'ui-scrolled-panel-wrapper',
					{ctor: '[]'},
					contents),
				_1: {ctor: '[]'}
			});
	});

var _gdotdesign$elm_ui$Ui_Styles_Input$inputStyle = function (theme) {
	return A2(
		_gdotdesign$elm_ui$Ui_Css$selector,
		'input',
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$focusedIdle(theme),
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$defaults,
				_1: {
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Css_Properties$border(
						A2(
							_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
							A2(
								_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
								_gdotdesign$elm_ui$Ui_Css_Properties$px(1),
								_gdotdesign$elm_ui$Ui_Css_Properties$solid),
							theme.colors.border)),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Css_Properties$backgroundColor(theme.colors.input.color),
						_1: {
							ctor: '::',
							_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderRadius(theme.borderRadius),
							_1: {
								ctor: '::',
								_0: _gdotdesign$elm_ui$Ui_Css_Properties$fontFamily(theme.fontFamily),
								_1: {
									ctor: '::',
									_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.input.bw),
									_1: {
										ctor: '::',
										_0: _gdotdesign$elm_ui$Ui_Css_Properties$padding(
											A2(
												_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
												_gdotdesign$elm_ui$Ui_Css_Properties$px(6),
												_gdotdesign$elm_ui$Ui_Css_Properties$px(9))),
										_1: {
											ctor: '::',
											_0: _gdotdesign$elm_ui$Ui_Css_Properties$lineHeight(
												_gdotdesign$elm_ui$Ui_Css_Properties$px(16)),
											_1: {
												ctor: '::',
												_0: _gdotdesign$elm_ui$Ui_Css_Properties$fontSize(
													_gdotdesign$elm_ui$Ui_Css_Properties$px(16)),
												_1: {
													ctor: '::',
													_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
														_gdotdesign$elm_ui$Ui_Css_Properties$pct(100)),
													_1: {
														ctor: '::',
														_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(
															_gdotdesign$elm_ui$Ui_Css_Properties$px(36)),
														_1: {
															ctor: '::',
															_0: A2(
																_gdotdesign$elm_ui$Ui_Css$selector,
																'&::-webkit-input-placeholder',
																{
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$lineHeight(
																		_gdotdesign$elm_ui$Ui_Css_Properties$px(22)),
																	_1: {ctor: '[]'}
																}),
															_1: {
																ctor: '::',
																_0: A2(
																	_gdotdesign$elm_ui$Ui_Css$selector,
																	'&[disabled]',
																	{
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$disabledColors(theme),
																		_1: {
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$disabled,
																			_1: {
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderColor(_gdotdesign$elm_ui$Ui_Css_Properties$transparent),
																				_1: {ctor: '[]'}
																			}
																		}
																	}),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_gdotdesign$elm_ui$Ui_Css$selector,
																		'&[readonly]',
																		{
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$readonly,
																			_1: {
																				ctor: '::',
																				_0: A2(
																					_gdotdesign$elm_ui$Ui_Css$selectors,
																					{
																						ctor: '::',
																						_0: '&::-moz-selection',
																						_1: {
																							ctor: '::',
																							_0: '&::selection',
																							_1: {ctor: '[]'}
																						}
																					},
																					{
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(_gdotdesign$elm_ui$Ui_Css_Properties$transparent),
																						_1: {ctor: '[]'}
																					}),
																				_1: {ctor: '[]'}
																			}
																		}),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_gdotdesign$elm_ui$Ui_Css$selector,
																			'&:focus',
																			{
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$focused(theme),
																				_1: {ctor: '[]'}
																			}),
																		_1: {ctor: '[]'}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Input$style = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$defaults,
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.input.bw),
				_1: {
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$inlineBlock),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$relative),
						_1: {
							ctor: '::',
							_0: _gdotdesign$elm_ui$Ui_Styles_Input$inputStyle(theme),
							_1: {
								ctor: '::',
								_0: A2(
									_gdotdesign$elm_ui$Ui_Css$selector,
									'&[clearable]',
									{
										ctor: '::',
										_0: A2(
											_gdotdesign$elm_ui$Ui_Css$selector,
											'input',
											{
												ctor: '::',
												_0: _gdotdesign$elm_ui$Ui_Css_Properties$paddingRight(
													_gdotdesign$elm_ui$Ui_Css_Properties$px(30)),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_gdotdesign$elm_ui$Ui_Css$selector,
												'svg',
												{
													ctor: '::',
													_0: _gdotdesign$elm_ui$Ui_Css_Properties$fill(_gdotdesign$elm_ui$Ui_Css_Properties$currentColor),
													_1: {
														ctor: '::',
														_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$absolute),
														_1: {
															ctor: '::',
															_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(
																_gdotdesign$elm_ui$Ui_Css_Properties$px(12)),
															_1: {
																ctor: '::',
																_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
																	_gdotdesign$elm_ui$Ui_Css_Properties$px(12)),
																_1: {
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$right(
																		_gdotdesign$elm_ui$Ui_Css_Properties$px(12)),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$top(
																			_gdotdesign$elm_ui$Ui_Css_Properties$px(12)),
																		_1: {
																			ctor: '::',
																			_0: A2(
																				_gdotdesign$elm_ui$Ui_Css$selector,
																				'&:hover',
																				{
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$fill(theme.colors.focus.color),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$cursor(_gdotdesign$elm_ui$Ui_Css_Properties$pointer),
																						_1: {ctor: '[]'}
																					}
																				}),
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}),
											_1: {ctor: '[]'}
										}
									}),
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Input$defaultStyle = _gdotdesign$elm_ui$Ui_Styles$attributes(
	_gdotdesign$elm_ui$Ui_Styles_Input$style(_gdotdesign$elm_ui$Ui_Styles_Theme$default));

var _gdotdesign$elm_ui$Ui_Styles_Chooser$chevronRight = function (color) {
	return A4(
		_elm_lang$core$Regex$replace,
		_elm_lang$core$Regex$All,
		_elm_lang$core$Regex$regex('\\n\\s*'),
		function (_p0) {
			return '';
		},
		A2(
			_elm_lang$core$Basics_ops['++'],
			'\n  <svg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'14\' viewBox=\'0 0 8 13.999605\' fill=\'',
			A2(_elm_lang$core$Basics_ops['++'], color, '\'>\n    <path d=\'M2.676 6.998l5.227-5.442c.132-.135.128-.357-.006-.494L6.963.105C6.828-.032 6.61-.035 6.478.1L.095 6.744c-.07.07-.1.163-.094.253-.002.094.03.185.095.254l6.383 6.65c.13.133.35.13.485-.007l.934-.957c.135-.137.138-.36.006-.494L2.676 7z\'/>\n    </svg>\n  ')));
};
var _gdotdesign$elm_ui$Ui_Styles_Chooser$style = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$defaults,
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Styles_Input$inputStyle(theme),
				_1: {
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.colors.input.bw),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$inlineBlock),
						_1: {
							ctor: '::',
							_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$relative),
							_1: {
								ctor: '::',
								_0: A2(
									_gdotdesign$elm_ui$Ui_Css$selector,
									'&:not([readonly]) input',
									{
										ctor: '::',
										_0: _gdotdesign$elm_ui$Ui_Css_Properties$cursor(_gdotdesign$elm_ui$Ui_Css_Properties$pointer),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_gdotdesign$elm_ui$Ui_Css$selector,
										'input',
										{
											ctor: '::',
											_0: _gdotdesign$elm_ui$Ui_Css_Properties$zIndex(2),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_gdotdesign$elm_ui$Ui_Css$selector,
											'&:before',
											{
												ctor: '::',
												_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderColor(
													A2(
														_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
														A2(_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'], _gdotdesign$elm_ui$Ui_Css_Properties$currentColor, _gdotdesign$elm_ui$Ui_Css_Properties$transparent),
														_gdotdesign$elm_ui$Ui_Css_Properties$transparent)),
												_1: {
													ctor: '::',
													_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderWidth(
														A2(
															_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
															A2(
																_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																_gdotdesign$elm_ui$Ui_Css_Properties$px(6),
																_gdotdesign$elm_ui$Ui_Css_Properties$px(5)),
															_gdotdesign$elm_ui$Ui_Css_Properties$zero)),
													_1: {
														ctor: '::',
														_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderStyle(_gdotdesign$elm_ui$Ui_Css_Properties$solid),
														_1: {
															ctor: '::',
															_0: _gdotdesign$elm_ui$Ui_Css_Properties$pointerEvents(_gdotdesign$elm_ui$Ui_Css_Properties$none),
															_1: {
																ctor: '::',
																_0: _gdotdesign$elm_ui$Ui_Css_Properties$transform(
																	{
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$scale(0.6),
																		_1: {ctor: '[]'}
																	}),
																_1: {
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$opacity(0),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$transition(
																			{
																				ctor: '::',
																				_0: {
																					easing: 'ease',
																					property: 'all',
																					duration: _gdotdesign$elm_ui$Ui_Css_Properties$ms(320),
																					delay: _gdotdesign$elm_ui$Ui_Css_Properties$ms(0)
																				},
																				_1: {ctor: '[]'}
																			}),
																		_1: {
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$top('calc(50% - 3px)'),
																			_1: {
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$absolute),
																				_1: {
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$contentString(''),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$right(
																							_gdotdesign$elm_ui$Ui_Css_Properties$px(15)),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(_gdotdesign$elm_ui$Ui_Css_Properties$zero),
																							_1: {
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(_gdotdesign$elm_ui$Ui_Css_Properties$zero),
																								_1: {
																									ctor: '::',
																									_0: _gdotdesign$elm_ui$Ui_Css_Properties$zIndex(4),
																									_1: {ctor: '[]'}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_gdotdesign$elm_ui$Ui_Css$selectors,
												{
													ctor: '::',
													_0: '&:not([searchable])',
													_1: {
														ctor: '::',
														_0: '&[searchable]:not([open])',
														_1: {ctor: '[]'}
													}
												},
												{
													ctor: '::',
													_0: A2(
														_gdotdesign$elm_ui$Ui_Css$selector,
														'&::after',
														{
															ctor: '::',
															_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(
																A2(
																	_elm_lang$core$Basics_ops['++'],
																	'linear-gradient(90deg, transparent, ',
																	A2(_elm_lang$core$Basics_ops['++'], theme.colors.input.color, ' 70%)'))),
															_1: {
																ctor: '::',
																_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderRadius(
																	A2(
																		_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																		A2(
																			_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																			A2(_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'], _gdotdesign$elm_ui$Ui_Css_Properties$zero, theme.borderRadius),
																			theme.borderRadius),
																		_gdotdesign$elm_ui$Ui_Css_Properties$zero)),
																_1: {
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$pointerEvents(_gdotdesign$elm_ui$Ui_Css_Properties$none),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$absolute),
																		_1: {
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
																				_gdotdesign$elm_ui$Ui_Css_Properties$pct(33.33)),
																			_1: {
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$contentString(''),
																				_1: {
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$bottom(
																						_gdotdesign$elm_ui$Ui_Css_Properties$px(4)),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$right(
																							_gdotdesign$elm_ui$Ui_Css_Properties$px(4)),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$top(
																								_gdotdesign$elm_ui$Ui_Css_Properties$px(4)),
																							_1: {
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$zIndex(3),
																								_1: {ctor: '[]'}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}),
													_1: {
														ctor: '::',
														_0: A2(
															_gdotdesign$elm_ui$Ui_Css$selector,
															'&::before',
															{
																ctor: '::',
																_0: _gdotdesign$elm_ui$Ui_Css_Properties$transform(
																	{
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$scale(1),
																		_1: {ctor: '[]'}
																	}),
																_1: {
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$opacity(0.6),
																	_1: {ctor: '[]'}
																}
															}),
														_1: {ctor: '[]'}
													}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_gdotdesign$elm_ui$Ui_Css$selector,
													'&[disabled]',
													{
														ctor: '::',
														_0: A2(
															_gdotdesign$elm_ui$Ui_Css$selectors,
															{
																ctor: '::',
																_0: '&:not([searchable])',
																_1: {
																	ctor: '::',
																	_0: '&[searchable]:not([open])',
																	_1: {ctor: '[]'}
																}
															},
															{
																ctor: '::',
																_0: A2(
																	_gdotdesign$elm_ui$Ui_Css$selector,
																	'&::after',
																	{
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(
																			A2(
																				_elm_lang$core$Basics_ops['++'],
																				'linear-gradient(90deg, transparent, ',
																				A2(_elm_lang$core$Basics_ops['++'], theme.colors.disabled.color, ' 70%)'))),
																		_1: {ctor: '[]'}
																	}),
																_1: {ctor: '[]'}
															}),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_gdotdesign$elm_ui$Ui_Css$selector,
														'ui-dropdown-panel[style-id]',
														{
															ctor: '::',
															_0: _gdotdesign$elm_ui$Ui_Css_Properties$maxHeight(
																_gdotdesign$elm_ui$Ui_Css_Properties$px(250)),
															_1: {
																ctor: '::',
																_0: _gdotdesign$elm_ui$Ui_Css_Properties$padding(
																	_gdotdesign$elm_ui$Ui_Css_Properties$px(5)),
																_1: {
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$flex),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_gdotdesign$elm_ui$Ui_Css$selector,
																			'ui-scrolled-panel-wrapper:empty:before',
																			{
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$contentString('No items to display!'),
																				_1: {
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$fontStyle(_gdotdesign$elm_ui$Ui_Css_Properties$italic),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$padding(
																							_gdotdesign$elm_ui$Ui_Css_Properties$px(12)),
																						_1: {
																							ctor: '::',
																							_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$block),
																							_1: {
																								ctor: '::',
																								_0: _gdotdesign$elm_ui$Ui_Css_Properties$opacity(0.5),
																								_1: {ctor: '[]'}
																							}
																						}
																					}
																				}
																			}),
																		_1: {ctor: '[]'}
																	}
																}
															}
														}),
													_1: {
														ctor: '::',
														_0: A2(
															_gdotdesign$elm_ui$Ui_Css$selector,
															'ui-chooser-item',
															{
																ctor: '::',
																_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$ellipsis,
																_1: {
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$borderRadius(theme.borderRadius),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$padding(
																			A2(
																				_gdotdesign$elm_ui$Ui_Css_Properties_ops['.'],
																				_gdotdesign$elm_ui$Ui_Css_Properties$px(8),
																				_gdotdesign$elm_ui$Ui_Css_Properties$px(10))),
																		_1: {
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$paddingRight(
																				_gdotdesign$elm_ui$Ui_Css_Properties$px(30)),
																			_1: {
																				ctor: '::',
																				_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$relative),
																				_1: {
																					ctor: '::',
																					_0: _gdotdesign$elm_ui$Ui_Css_Properties$cursor(_gdotdesign$elm_ui$Ui_Css_Properties$pointer),
																					_1: {
																						ctor: '::',
																						_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$block),
																						_1: {
																							ctor: '::',
																							_0: A2(
																								_gdotdesign$elm_ui$Ui_Css$selector,
																								'&[intended]',
																								{
																									ctor: '::',
																									_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.chooser.intendedColors.background),
																									_1: {
																										ctor: '::',
																										_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.chooser.intendedColors.text),
																										_1: {
																											ctor: '::',
																											_0: A2(
																												_gdotdesign$elm_ui$Ui_Css$selector,
																												'&:hover',
																												{
																													ctor: '::',
																													_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.chooser.intendedHoverColors.background),
																													_1: {
																														ctor: '::',
																														_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.chooser.intendedHoverColors.text),
																														_1: {ctor: '[]'}
																													}
																												}),
																											_1: {
																												ctor: '::',
																												_0: A2(
																													_gdotdesign$elm_ui$Ui_Css$selector,
																													'&:before',
																													{
																														ctor: '::',
																														_0: _gdotdesign$elm_ui$Ui_Css_Properties$content(
																															A2(
																																_elm_lang$core$Basics_ops['++'],
																																'url(\"data:image/svg+xml;utf8,',
																																A2(
																																	_elm_lang$core$Basics_ops['++'],
																																	_gdotdesign$elm_ui$Ui_Styles_Chooser$chevronRight(theme.chooser.intendedColors.text),
																																	'\")'))),
																														_1: {
																															ctor: '::',
																															_0: _gdotdesign$elm_ui$Ui_Css_Properties$top('calc(50% - 7px)'),
																															_1: {
																																ctor: '::',
																																_0: _gdotdesign$elm_ui$Ui_Css_Properties$position(_gdotdesign$elm_ui$Ui_Css_Properties$absolute),
																																_1: {
																																	ctor: '::',
																																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$fill(_gdotdesign$elm_ui$Ui_Css_Properties$currentColor),
																																	_1: {
																																		ctor: '::',
																																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$right(
																																			_gdotdesign$elm_ui$Ui_Css_Properties$px(10)),
																																		_1: {ctor: '[]'}
																																	}
																																}
																															}
																														}
																													}),
																												_1: {ctor: '[]'}
																											}
																										}
																									}
																								}),
																							_1: {
																								ctor: '::',
																								_0: A2(
																									_gdotdesign$elm_ui$Ui_Css$selector,
																									'&:hover',
																									{
																										ctor: '::',
																										_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.chooser.hoverColors.background),
																										_1: {
																											ctor: '::',
																											_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.chooser.hoverColors.text),
																											_1: {ctor: '[]'}
																										}
																									}),
																								_1: {
																									ctor: '::',
																									_0: A2(
																										_gdotdesign$elm_ui$Ui_Css$selector,
																										'&[selected]',
																										{
																											ctor: '::',
																											_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.chooser.selectedColors.background),
																											_1: {
																												ctor: '::',
																												_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.chooser.selectedColors.text),
																												_1: {
																													ctor: '::',
																													_0: A2(
																														_gdotdesign$elm_ui$Ui_Css$selector,
																														'&:hover',
																														{
																															ctor: '::',
																															_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.chooser.selectedHoverColors.background),
																															_1: {
																																ctor: '::',
																																_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.chooser.selectedHoverColors.text),
																																_1: {ctor: '[]'}
																															}
																														}),
																													_1: {ctor: '[]'}
																												}
																											}
																										}),
																									_1: {
																										ctor: '::',
																										_0: A2(
																											_gdotdesign$elm_ui$Ui_Css$selector,
																											'&[selected][intended]',
																											{
																												ctor: '::',
																												_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.chooser.selectedIntendedColors.background),
																												_1: {
																													ctor: '::',
																													_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.chooser.selectedIntendedColors.text),
																													_1: {
																														ctor: '::',
																														_0: A2(
																															_gdotdesign$elm_ui$Ui_Css$selector,
																															'&:hover',
																															{
																																ctor: '::',
																																_0: _gdotdesign$elm_ui$Ui_Css_Properties$background(theme.chooser.selectedIntendedHoverColors.background),
																																_1: {
																																	ctor: '::',
																																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$color(theme.chooser.selectedIntendedHoverColors.text),
																																	_1: {ctor: '[]'}
																																}
																															}),
																														_1: {
																															ctor: '::',
																															_0: A2(
																																_gdotdesign$elm_ui$Ui_Css$selector,
																																'&:before',
																																{
																																	ctor: '::',
																																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$content(
																																		A2(
																																			_elm_lang$core$Basics_ops['++'],
																																			'url(\"data:image/svg+xml;utf8,',
																																			A2(
																																				_elm_lang$core$Basics_ops['++'],
																																				_gdotdesign$elm_ui$Ui_Styles_Chooser$chevronRight(theme.chooser.selectedIntendedHoverColors.text),
																																				'\")'))),
																																	_1: {ctor: '[]'}
																																}),
																															_1: {ctor: '[]'}
																														}
																													}
																												}
																											}),
																										_1: {
																											ctor: '::',
																											_0: A2(
																												_gdotdesign$elm_ui$Ui_Css$selector,
																												'+ ui-chooser-item',
																												{
																													ctor: '::',
																													_0: _gdotdesign$elm_ui$Ui_Css_Properties$marginTop(
																														_gdotdesign$elm_ui$Ui_Css_Properties$px(3)),
																													_1: {ctor: '[]'}
																												}),
																											_1: {ctor: '[]'}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}),
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Chooser$defaultStyle = _gdotdesign$elm_ui$Ui_Styles$attributes(
	_gdotdesign$elm_ui$Ui_Styles_Chooser$style(_gdotdesign$elm_ui$Ui_Styles_Theme$default));

var _gdotdesign$elm_ui$Ui_Chooser$createRegex = function (value) {
	return _elm_lang$core$Regex$caseInsensitive(
		_elm_lang$core$Regex$regex(
			_elm_lang$core$Regex$escape(value)));
};
var _gdotdesign$elm_ui$Ui_Chooser$items_ = function (model) {
	var test = function (item) {
		return A2(
			_elm_lang$core$Regex$contains,
			_gdotdesign$elm_ui$Ui_Chooser$createRegex(model.value),
			item.label);
	};
	return _elm_lang$core$String$isEmpty(
		_elm_lang$core$String$trim(model.value)) ? model.data : A2(_elm_lang$core$List$filter, test, model.data);
};
var _gdotdesign$elm_ui$Ui_Chooser$availableItems = function (model) {
	return A2(
		_elm_lang$core$List$map,
		function (_) {
			return _.value;
		},
		_gdotdesign$elm_ui$Ui_Chooser$items_(model));
};
var _gdotdesign$elm_ui$Ui_Chooser$label = function (model) {
	return A2(
		_elm_lang$core$String$join,
		', ',
		A2(
			_elm_lang$core$List$map,
			function (_) {
				return _.label;
			},
			A2(
				_elm_lang$core$List$filter,
				function (item) {
					return A2(_elm_lang$core$Set$member, item.value, model.selected);
				},
				model.data)));
};
var _gdotdesign$elm_ui$Ui_Chooser$setInputValue = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{value: value});
	});
var _gdotdesign$elm_ui$Ui_Chooser$intendFirst = function (model) {
	var available = _gdotdesign$elm_ui$Ui_Chooser$availableItems(model);
	var index = A2(_gdotdesign$elm_ui$Ui_Helpers_Intendable$index, model.intended, available);
	return _elm_lang$core$Native_Utils.eq(index, -1) ? _elm_lang$core$Native_Utils.update(
		model,
		{
			intended: A2(_gdotdesign$elm_ui$Ui_Helpers_Intendable$next, '', available)
		}) : model;
};
var _gdotdesign$elm_ui$Ui_Chooser$sendValue = function (model) {
	var value = _elm_lang$core$Json_Encode$list(
		A2(
			_elm_lang$core$List$map,
			_elm_lang$core$Json_Encode$string,
			_elm_lang$core$Set$toList(model.selected)));
	return {
		ctor: '_Tuple2',
		_0: model,
		_1: A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$send, model.uid, value)
	};
};
var _gdotdesign$elm_ui$Ui_Chooser$toggleMultipleItem = F2(
	function (value, model) {
		var updated_set = A2(_elm_lang$core$Set$member, value, model.selected) ? ((model.deselectable || (_elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$Set$size(model.selected),
			1) > 0)) ? A2(_elm_lang$core$Set$remove, value, model.selected) : model.selected) : A2(_elm_lang$core$Set$insert, value, model.selected);
		return _gdotdesign$elm_ui$Ui_Chooser$sendValue(
			_elm_lang$core$Native_Utils.update(
				model,
				{selected: updated_set}));
	});
var _gdotdesign$elm_ui$Ui_Chooser$toggleSingleItem = F2(
	function (value, model) {
		var updatedModel = (A2(_elm_lang$core$Set$member, value, model.selected) && model.deselectable) ? _elm_lang$core$Native_Utils.update(
			model,
			{selected: _elm_lang$core$Set$empty}) : _elm_lang$core$Native_Utils.update(
			model,
			{
				selected: _elm_lang$core$Set$singleton(value)
			});
		return _gdotdesign$elm_ui$Ui_Chooser$sendValue(updatedModel);
	});
var _gdotdesign$elm_ui$Ui_Chooser$selectFirst = function (model) {
	var _p0 = _elm_lang$core$List$head(model.data);
	if (_p0.ctor === 'Just') {
		return _gdotdesign$elm_ui$Ui_Chooser$sendValue(
			_elm_lang$core$Native_Utils.update(
				model,
				{
					selected: _elm_lang$core$Set$singleton(_p0._0.value)
				}));
	} else {
		return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
	}
};
var _gdotdesign$elm_ui$Ui_Chooser$updateData = F2(
	function (data, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{data: data});
	});
var _gdotdesign$elm_ui$Ui_Chooser$getFirstSelected = function (model) {
	return _elm_lang$core$List$head(
		_elm_lang$core$Set$toList(model.selected));
};
var _gdotdesign$elm_ui$Ui_Chooser$toggleItem = F2(
	function (value, model) {
		return model.multiple ? A2(_gdotdesign$elm_ui$Ui_Chooser$toggleMultipleItem, value, model) : A2(_gdotdesign$elm_ui$Ui_Chooser$toggleSingleItem, value, model);
	});
var _gdotdesign$elm_ui$Ui_Chooser$close = function (model) {
	return A2(
		_gdotdesign$elm_ui$Ui_Chooser$setInputValue,
		'',
		_gdotdesign$elm_ui$Ui_Helpers_Dropdown$close(model));
};
var _gdotdesign$elm_ui$Ui_Chooser$closeIfShouldClose = function (model) {
	return model.closeOnSelect ? _gdotdesign$elm_ui$Ui_Chooser$close(model) : model;
};
var _gdotdesign$elm_ui$Ui_Chooser$toggleItemAndClose = F2(
	function (value, model) {
		var _p1 = A2(_gdotdesign$elm_ui$Ui_Chooser$toggleItem, value, model);
		var updatedModel = _p1._0;
		var effect = _p1._1;
		return {
			ctor: '_Tuple2',
			_0: _gdotdesign$elm_ui$Ui_Chooser$closeIfShouldClose(updatedModel),
			_1: effect
		};
	});
var _gdotdesign$elm_ui$Ui_Chooser$setValue = F2(
	function (value, model) {
		var newSelected = _elm_lang$core$Set$singleton(value);
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$Set$size(
				A2(_elm_lang$core$Set$diff, newSelected, model.selected)),
			0) ? model : _elm_lang$core$Native_Utils.update(
			model,
			{selected: newSelected});
	});
var _gdotdesign$elm_ui$Ui_Chooser$update = F2(
	function (action, model) {
		var _p2 = action;
		switch (_p2.ctor) {
			case 'Enter':
				var $function = model.closeOnSelect ? _gdotdesign$elm_ui$Ui_Helpers_Dropdown$toggle : _gdotdesign$elm_ui$Ui_Helpers_Dropdown$open;
				var _p3 = A2(_gdotdesign$elm_ui$Ui_Chooser$toggleItem, model.intended, model);
				var updatedModel = _p3._0;
				var effect = _p3._1;
				return {
					ctor: '_Tuple2',
					_0: $function(updatedModel),
					_1: effect
				};
			case 'Dropdown':
				return {
					ctor: '_Tuple2',
					_0: A2(_gdotdesign$elm_ui$Ui_Helpers_Dropdown$update, _p2._0, model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Select':
				return A2(_gdotdesign$elm_ui$Ui_Chooser$toggleItemAndClose, _p2._0, model);
			case 'Filter':
				return {
					ctor: '_Tuple2',
					_0: _gdotdesign$elm_ui$Ui_Chooser$intendFirst(
						A2(_gdotdesign$elm_ui$Ui_Chooser$setInputValue, _p2._0, model)),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Toggle':
				return {
					ctor: '_Tuple2',
					_0: _gdotdesign$elm_ui$Ui_Chooser$intendFirst(
						_gdotdesign$elm_ui$Ui_Helpers_Dropdown$open(model)),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Focus':
				return {
					ctor: '_Tuple2',
					_0: _gdotdesign$elm_ui$Ui_Chooser$intendFirst(
						_gdotdesign$elm_ui$Ui_Helpers_Dropdown$open(model)),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Close':
				return {
					ctor: '_Tuple2',
					_0: _gdotdesign$elm_ui$Ui_Chooser$close(model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Blur':
				return {
					ctor: '_Tuple2',
					_0: _gdotdesign$elm_ui$Ui_Chooser$close(model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Next':
				return {
					ctor: '_Tuple2',
					_0: _gdotdesign$elm_ui$Ui_Helpers_Dropdown$open(
						_elm_lang$core$Native_Utils.update(
							model,
							{
								intended: A2(
									_gdotdesign$elm_ui$Ui_Helpers_Intendable$next,
									model.intended,
									_gdotdesign$elm_ui$Ui_Chooser$availableItems(model))
							})),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Prev':
				return {
					ctor: '_Tuple2',
					_0: _gdotdesign$elm_ui$Ui_Helpers_Dropdown$open(
						_elm_lang$core$Native_Utils.update(
							model,
							{
								intended: A2(
									_gdotdesign$elm_ui$Ui_Helpers_Intendable$previous,
									model.intended,
									_gdotdesign$elm_ui$Ui_Chooser$availableItems(model))
							})),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _gdotdesign$elm_ui$Ui_Chooser$renderWhenClosed = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{renderWhenClosed: value});
	});
var _gdotdesign$elm_ui$Ui_Chooser$items = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{data: value});
	});
var _gdotdesign$elm_ui$Ui_Chooser$multiple = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{multiple: value});
	});
var _gdotdesign$elm_ui$Ui_Chooser$searchable = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{searchable: value});
	});
var _gdotdesign$elm_ui$Ui_Chooser$deselectable = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{deselectable: value});
	});
var _gdotdesign$elm_ui$Ui_Chooser$closeOnSelect = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{closeOnSelect: value});
	});
var _gdotdesign$elm_ui$Ui_Chooser$placeholder = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{placeholder: value});
	});
var _gdotdesign$elm_ui$Ui_Chooser$onChange = F2(
	function (msg, model) {
		var decoder = A2(
			_elm_lang$core$Json_Decode$map,
			_elm_lang$core$Set$fromList,
			_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string));
		return A2(
			_gdotdesign$elm_ui$Ui_Helpers_Emitter$listen,
			model.uid,
			A3(_gdotdesign$elm_ui$Ui_Helpers_Emitter$decode, decoder, _elm_lang$core$Set$empty, msg));
	});
var _gdotdesign$elm_ui$Ui_Chooser$init = function (_p4) {
	return A2(
		_gdotdesign$elm_ui$Ui_Helpers_Dropdown$offset,
		5,
		{
			render: function (item) {
				return _elm_lang$html$Html$text(item.label);
			},
			dropdown: _gdotdesign$elm_ui$Ui_Helpers_Dropdown$init,
			renderWhenClosed: true,
			closeOnSelect: false,
			deselectable: false,
			selected: _elm_lang$core$Set$empty,
			searchable: false,
			multiple: false,
			disabled: false,
			readonly: false,
			placeholder: '',
			uid: _gdotdesign$elm_ui$Ui_Native_Uid$uid(
				{ctor: '_Tuple0'}),
			intended: '',
			value: '',
			data: {ctor: '[]'}
		});
};
var _gdotdesign$elm_ui$Ui_Chooser$Item = F3(
	function (a, b, c) {
		return {label: a, value: b, id: c};
	});
var _gdotdesign$elm_ui$Ui_Chooser$Model = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return function (m) {
													return function (n) {
														return function (o) {
															return {render: a, dropdown: b, renderWhenClosed: c, selected: d, placeholder: e, closeOnSelect: f, deselectable: g, intended: h, searchable: i, data: j, multiple: k, disabled: l, readonly: m, value: n, uid: o};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _gdotdesign$elm_ui$Ui_Chooser$Blur = {ctor: 'Blur'};
var _gdotdesign$elm_ui$Ui_Chooser$NoOp = {ctor: 'NoOp'};
var _gdotdesign$elm_ui$Ui_Chooser$Prev = {ctor: 'Prev'};
var _gdotdesign$elm_ui$Ui_Chooser$Next = {ctor: 'Next'};
var _gdotdesign$elm_ui$Ui_Chooser$Enter = {ctor: 'Enter'};
var _gdotdesign$elm_ui$Ui_Chooser$Close = {ctor: 'Close'};
var _gdotdesign$elm_ui$Ui_Chooser$Focus = {ctor: 'Focus'};
var _gdotdesign$elm_ui$Ui_Chooser$Toggle = {ctor: 'Toggle'};
var _gdotdesign$elm_ui$Ui_Chooser$Select = function (a) {
	return {ctor: 'Select', _0: a};
};
var _gdotdesign$elm_ui$Ui_Chooser$renderItem = F2(
	function (model, item) {
		return A3(
			_elm_lang$html$Html$node,
			'ui-chooser-item',
			_elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: {
						ctor: '::',
						_0: A2(
							_gdotdesign$elm_ui$Html_Events_Extra$onPreventDefault,
							'mousedown',
							_gdotdesign$elm_ui$Ui_Chooser$Select(item.value)),
						_1: {ctor: '[]'}
					},
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui$attributeList(
							{
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'selected',
									_1: A2(_elm_lang$core$Set$member, item.value, model.selected)
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'intended',
										_1: _elm_lang$core$Native_Utils.eq(item.value, model.intended)
									},
									_1: {ctor: '[]'}
								}
							}),
						_1: {ctor: '[]'}
					}
				}),
			{
				ctor: '::',
				_0: model.render(item),
				_1: {ctor: '[]'}
			});
	});
var _gdotdesign$elm_ui$Ui_Chooser$Filter = function (a) {
	return {ctor: 'Filter', _0: a};
};
var _gdotdesign$elm_ui$Ui_Chooser$Dropdown = function (a) {
	return {ctor: 'Dropdown', _0: a};
};
var _gdotdesign$elm_ui$Ui_Chooser$subscriptions = function (model) {
	return A2(
		_elm_lang$core$Platform_Sub$map,
		_gdotdesign$elm_ui$Ui_Chooser$Dropdown,
		_gdotdesign$elm_ui$Ui_Helpers_Dropdown$subscriptions(model));
};
var _gdotdesign$elm_ui$Ui_Chooser$render = function (model) {
	var actions = A2(
		_gdotdesign$elm_ui$Ui$enabledActions,
		model,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Events$onMouseDown(_gdotdesign$elm_ui$Ui_Chooser$Toggle),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onInput(_gdotdesign$elm_ui$Ui_Chooser$Filter),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onFocus(_gdotdesign$elm_ui$Ui_Chooser$Focus),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onBlur(_gdotdesign$elm_ui$Ui_Chooser$Blur),
						_1: {
							ctor: '::',
							_0: A2(
								_gdotdesign$elm_ui$Html_Events_Extra$onKeys,
								true,
								A2(
									_elm_lang$core$Basics_ops['++'],
									{
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 27, _1: _gdotdesign$elm_ui$Ui_Chooser$Close},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 13, _1: _gdotdesign$elm_ui$Ui_Chooser$Enter},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 40, _1: _gdotdesign$elm_ui$Ui_Chooser$Next},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 38, _1: _gdotdesign$elm_ui$Ui_Chooser$Prev},
													_1: {ctor: '[]'}
												}
											}
										}
									},
									(!model.searchable) ? {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 32, _1: _gdotdesign$elm_ui$Ui_Chooser$Enter},
										_1: {ctor: '[]'}
									} : {ctor: '[]'})),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
	var isReadOnly = (!model.searchable) || ((!model.dropdown.open) || model.readonly);
	var placeholder_ = _elm_lang$core$Set$isEmpty(model.selected) ? model.placeholder : _gdotdesign$elm_ui$Ui_Chooser$label(model);
	var val = (model.dropdown.open && model.searchable) ? model.value : _gdotdesign$elm_ui$Ui_Chooser$label(model);
	var children = (model.dropdown.open || ((!model.dropdown.open) && model.renderWhenClosed)) ? A2(
		_elm_lang$core$List$map,
		A2(_elm_lang$html$Html_Lazy$lazy2, _gdotdesign$elm_ui$Ui_Chooser$renderItem, model),
		_gdotdesign$elm_ui$Ui_Chooser$items_(model)) : {ctor: '[]'};
	return A2(
		_gdotdesign$elm_ui$Ui_Helpers_Dropdown$view,
		{
			address: _gdotdesign$elm_ui$Ui_Chooser$Dropdown,
			tag: 'ui-chooser',
			attributes: _elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui$attributeList(
						{
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'searchable', _1: model.searchable},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'open', _1: model.dropdown.open},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'disabled', _1: model.disabled},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'readonly', _1: model.readonly},
										_1: {ctor: '[]'}
									}
								}
							}
						}),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Styles$apply(_gdotdesign$elm_ui$Ui_Styles_Chooser$defaultStyle),
						_1: {ctor: '[]'}
					}
				}),
			contents: {
				ctor: '::',
				_0: A2(
					_gdotdesign$elm_ui$Ui_ScrolledPanel$view,
					{
						ctor: '::',
						_0: A2(_gdotdesign$elm_ui$Html_Events_Extra$onPreventDefault, 'mousedown', _gdotdesign$elm_ui$Ui_Chooser$NoOp),
						_1: {ctor: '[]'}
					},
					children),
				_1: {ctor: '[]'}
			},
			children: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$input,
					A2(
						_elm_lang$core$Basics_ops['++'],
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$placeholder(placeholder_),
							_1: {
								ctor: '::',
								_0: A2(_elm_lang$html$Html_Attributes$attribute, 'id', model.uid),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$disabled(model.disabled),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$readonly(isReadOnly),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$value(val),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						},
						actions),
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			}
		},
		model);
};
var _gdotdesign$elm_ui$Ui_Chooser$view = function (model) {
	return A2(_elm_lang$html$Html_Lazy$lazy, _gdotdesign$elm_ui$Ui_Chooser$render, model);
};

var _gdotdesign$elm_ui$Ui_Styles_Ratings$style = function (theme) {
	return _gdotdesign$elm_ui$Ui_Css$mixin(
		{
			ctor: '::',
			_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$defaults,
			_1: {
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$inlineBlock),
				_1: {
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Css_Properties$cursor(_gdotdesign$elm_ui$Ui_Css_Properties$pointer),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(
							_gdotdesign$elm_ui$Ui_Css_Properties$px(36)),
						_1: {
							ctor: '::',
							_0: _gdotdesign$elm_ui$Ui_Css_Properties$outline(_gdotdesign$elm_ui$Ui_Css_Properties$none),
							_1: {
								ctor: '::',
								_0: A2(
									_gdotdesign$elm_ui$Ui_Css$selector,
									'ui-ratings-star',
									{
										ctor: '::',
										_0: _gdotdesign$elm_ui$Ui_Css_Properties$justifyContent(_gdotdesign$elm_ui$Ui_Css_Properties$center),
										_1: {
											ctor: '::',
											_0: _gdotdesign$elm_ui$Ui_Css_Properties$display(_gdotdesign$elm_ui$Ui_Css_Properties$inlineFlex),
											_1: {
												ctor: '::',
												_0: _gdotdesign$elm_ui$Ui_Css_Properties$alignItems(_gdotdesign$elm_ui$Ui_Css_Properties$center),
												_1: {
													ctor: '::',
													_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(
														_gdotdesign$elm_ui$Ui_Css_Properties$px(36)),
													_1: {
														ctor: '::',
														_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
															_gdotdesign$elm_ui$Ui_Css_Properties$px(36)),
														_1: {
															ctor: '::',
															_0: A2(
																_gdotdesign$elm_ui$Ui_Css$selector,
																'svg',
																{
																	ctor: '::',
																	_0: _gdotdesign$elm_ui$Ui_Css_Properties$fill(theme.colors.input.bw),
																	_1: {
																		ctor: '::',
																		_0: _gdotdesign$elm_ui$Ui_Css_Properties$height(
																			_gdotdesign$elm_ui$Ui_Css_Properties$px(28)),
																		_1: {
																			ctor: '::',
																			_0: _gdotdesign$elm_ui$Ui_Css_Properties$width(
																				_gdotdesign$elm_ui$Ui_Css_Properties$px(28)),
																			_1: {ctor: '[]'}
																		}
																	}
																}),
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_gdotdesign$elm_ui$Ui_Css$selector,
										'&:not([disabled])',
										{
											ctor: '::',
											_0: A2(
												_gdotdesign$elm_ui$Ui_Css$selectors,
												{
													ctor: '::',
													_0: '&:focus svg',
													_1: {
														ctor: '::',
														_0: '&:hover svg',
														_1: {ctor: '[]'}
													}
												},
												{
													ctor: '::',
													_0: _gdotdesign$elm_ui$Ui_Css_Properties$fill(theme.colors.focus.color),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_gdotdesign$elm_ui$Ui_Css$selector,
											'&[disabled]',
											{
												ctor: '::',
												_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$disabled,
												_1: {
													ctor: '::',
													_0: A2(
														_gdotdesign$elm_ui$Ui_Css$selector,
														'svg',
														{
															ctor: '::',
															_0: _gdotdesign$elm_ui$Ui_Css_Properties$fill(theme.colors.disabled.color),
															_1: {ctor: '[]'}
														}),
													_1: {ctor: '[]'}
												}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_gdotdesign$elm_ui$Ui_Css$selector,
												'&[readonly]',
												{
													ctor: '::',
													_0: _gdotdesign$elm_ui$Ui_Styles_Mixins$disabled,
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _gdotdesign$elm_ui$Ui_Styles_Ratings$defaultStyle = _gdotdesign$elm_ui$Ui_Styles$attributes(
	_gdotdesign$elm_ui$Ui_Styles_Ratings$style(_gdotdesign$elm_ui$Ui_Styles_Theme$default));

var _gdotdesign$elm_ui$Ui_Ratings$sendValue = function (model) {
	return A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$sendFloat, model.uid, model.value);
};
var _gdotdesign$elm_ui$Ui_Ratings$valueAsStars = F2(
	function (value, model) {
		return _elm_lang$core$Basics$round(
			value * _elm_lang$core$Basics$toFloat(model.size));
	});
var _gdotdesign$elm_ui$Ui_Ratings$calculateValue = F2(
	function (index, model) {
		var currentIndex = A2(_gdotdesign$elm_ui$Ui_Ratings$valueAsStars, model.value, model);
		var value = A3(
			_elm_lang$core$Basics$clamp,
			0,
			1,
			_elm_lang$core$Basics$toFloat(index) / _elm_lang$core$Basics$toFloat(model.size));
		return (_elm_lang$core$Native_Utils.eq(currentIndex, index) && model.clearable) ? 0 : value;
	});
var _gdotdesign$elm_ui$Ui_Ratings$setValue = F2(
	function (value_, model) {
		var value = A2(_gdotdesign$elm_ui$Ext_Number$roundTo, 2, value_);
		return (_elm_lang$core$Native_Utils.eq(model.value, value) && _elm_lang$core$Native_Utils.eq(model.hoverValue, value)) ? model : _elm_lang$core$Native_Utils.update(
			model,
			{value: value, hoverValue: value});
	});
var _gdotdesign$elm_ui$Ui_Ratings$setValueAsStars = F2(
	function (value_, model) {
		var value = A3(
			_elm_lang$core$Basics$clamp,
			0,
			1,
			_elm_lang$core$Basics$toFloat(value_) / _elm_lang$core$Basics$toFloat(model.size));
		return A2(_gdotdesign$elm_ui$Ui_Ratings$setValue, value, model);
	});
var _gdotdesign$elm_ui$Ui_Ratings$setAndSendValue = F2(
	function (value, model) {
		var updatedModel = A2(_gdotdesign$elm_ui$Ui_Ratings$setValue, value, model);
		return _elm_lang$core$Native_Utils.eq(model.value, updatedModel.value) ? {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none} : {
			ctor: '_Tuple2',
			_0: updatedModel,
			_1: _gdotdesign$elm_ui$Ui_Ratings$sendValue(updatedModel)
		};
	});
var _gdotdesign$elm_ui$Ui_Ratings$update = F2(
	function (msg, model) {
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'MouseEnter':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							hoverValue: A2(_gdotdesign$elm_ui$Ui_Ratings$calculateValue, _p0._0, model)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'MouseLeave':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{hoverValue: model.value}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Increment':
				return A2(
					_gdotdesign$elm_ui$Ui_Ratings$setAndSendValue,
					A3(
						_elm_lang$core$Basics$clamp,
						0,
						1,
						model.value + (1 / _elm_lang$core$Basics$toFloat(model.size))),
					model);
			case 'Decrement':
				var oneStarValue = 1 / _elm_lang$core$Basics$toFloat(model.size);
				var min = model.clearable ? 0 : oneStarValue;
				return A2(
					_gdotdesign$elm_ui$Ui_Ratings$setAndSendValue,
					A3(_elm_lang$core$Basics$clamp, oneStarValue, 1, model.value - oneStarValue),
					model);
			default:
				return A2(
					_gdotdesign$elm_ui$Ui_Ratings$setAndSendValue,
					A2(_gdotdesign$elm_ui$Ui_Ratings$calculateValue, _p0._0, model),
					model);
		}
	});
var _gdotdesign$elm_ui$Ui_Ratings$size = F2(
	function (value, model) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{size: value});
	});
var _gdotdesign$elm_ui$Ui_Ratings$onChange = F2(
	function (msg, model) {
		return A2(_gdotdesign$elm_ui$Ui_Helpers_Emitter$listenFloat, model.uid, msg);
	});
var _gdotdesign$elm_ui$Ui_Ratings$init = function (_p1) {
	return {
		clearable: false,
		uid: _gdotdesign$elm_ui$Ui_Native_Uid$uid(
			{ctor: '_Tuple0'}),
		disabled: false,
		readonly: false,
		hoverValue: 0,
		value: 0,
		size: 5
	};
};
var _gdotdesign$elm_ui$Ui_Ratings$Model = F7(
	function (a, b, c, d, e, f, g) {
		return {hoverValue: a, clearable: b, disabled: c, readonly: d, value: e, uid: f, size: g};
	});
var _gdotdesign$elm_ui$Ui_Ratings$Click = function (a) {
	return {ctor: 'Click', _0: a};
};
var _gdotdesign$elm_ui$Ui_Ratings$Decrement = {ctor: 'Decrement'};
var _gdotdesign$elm_ui$Ui_Ratings$Increment = {ctor: 'Increment'};
var _gdotdesign$elm_ui$Ui_Ratings$MouseLeave = {ctor: 'MouseLeave'};
var _gdotdesign$elm_ui$Ui_Ratings$MouseEnter = function (a) {
	return {ctor: 'MouseEnter', _0: a};
};
var _gdotdesign$elm_ui$Ui_Ratings$renderStar = F2(
	function (model, index) {
		var icon = (_elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$Basics$toFloat(index) / _elm_lang$core$Basics$toFloat(model.size),
			model.hoverValue) < 1) ? _gdotdesign$elm_ui$Ui_Icons$starFull : _gdotdesign$elm_ui$Ui_Icons$starEmpty;
		var actions = A2(
			_gdotdesign$elm_ui$Ui$enabledActions,
			model,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onMouseEnter(
					_gdotdesign$elm_ui$Ui_Ratings$MouseEnter(index)),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onMouseLeave(_gdotdesign$elm_ui$Ui_Ratings$MouseLeave),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(
							_gdotdesign$elm_ui$Ui_Ratings$Click(index)),
						_1: {ctor: '[]'}
					}
				}
			});
		return A3(
			_elm_lang$html$Html$node,
			'ui-ratings-star',
			actions,
			{
				ctor: '::',
				_0: icon(
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			});
	});
var _gdotdesign$elm_ui$Ui_Ratings$render = function (model) {
	var stars = _elm_lang$core$Array$toList(
		A2(
			_elm_lang$core$Array$initialize,
			model.size,
			F2(
				function (x, y) {
					return x + y;
				})(1)));
	var actions = A2(
		_gdotdesign$elm_ui$Ui$enabledActions,
		model,
		{
			ctor: '::',
			_0: A2(
				_gdotdesign$elm_ui$Html_Events_Extra$onKeys,
				true,
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 40, _1: _gdotdesign$elm_ui$Ui_Ratings$Decrement},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 38, _1: _gdotdesign$elm_ui$Ui_Ratings$Increment},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 37, _1: _gdotdesign$elm_ui$Ui_Ratings$Decrement},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 39, _1: _gdotdesign$elm_ui$Ui_Ratings$Increment},
								_1: {ctor: '[]'}
							}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
	return A3(
		_elm_lang$html$Html$node,
		'ui-ratings',
		_elm_lang$core$List$concat(
			{
				ctor: '::',
				_0: _gdotdesign$elm_ui$Ui$attributeList(
					{
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'disabled', _1: model.disabled},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'readonly', _1: model.readonly},
							_1: {ctor: '[]'}
						}
					}),
				_1: {
					ctor: '::',
					_0: _gdotdesign$elm_ui$Ui_Styles$apply(_gdotdesign$elm_ui$Ui_Styles_Ratings$defaultStyle),
					_1: {
						ctor: '::',
						_0: _gdotdesign$elm_ui$Ui$tabIndex(model),
						_1: {
							ctor: '::',
							_0: actions,
							_1: {ctor: '[]'}
						}
					}
				}
			}),
		A2(
			_elm_lang$core$List$map,
			_gdotdesign$elm_ui$Ui_Ratings$renderStar(model),
			stars));
};
var _gdotdesign$elm_ui$Ui_Ratings$view = function (model) {
	return A2(_elm_lang$html$Html_Lazy$lazy, _gdotdesign$elm_ui$Ui_Ratings$render, model);
};

var _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerSecond = 1000;
var _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute = 60 * _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerSecond;
var _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerHour = 60 * _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute;
var _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerDay = 24 * _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerHour;
var _justinmimbs$elm_date_extra$Date_Extra_Facts$dayOfWeekFromWeekdayNumber = function (n) {
	var _p0 = n;
	switch (_p0) {
		case 1:
			return _elm_lang$core$Date$Mon;
		case 2:
			return _elm_lang$core$Date$Tue;
		case 3:
			return _elm_lang$core$Date$Wed;
		case 4:
			return _elm_lang$core$Date$Thu;
		case 5:
			return _elm_lang$core$Date$Fri;
		case 6:
			return _elm_lang$core$Date$Sat;
		default:
			return _elm_lang$core$Date$Sun;
	}
};
var _justinmimbs$elm_date_extra$Date_Extra_Facts$weekdayNumberFromDayOfWeek = function (d) {
	var _p1 = d;
	switch (_p1.ctor) {
		case 'Mon':
			return 1;
		case 'Tue':
			return 2;
		case 'Wed':
			return 3;
		case 'Thu':
			return 4;
		case 'Fri':
			return 5;
		case 'Sat':
			return 6;
		default:
			return 7;
	}
};
var _justinmimbs$elm_date_extra$Date_Extra_Facts$monthFromMonthNumber = function (n) {
	var _p2 = n;
	switch (_p2) {
		case 1:
			return _elm_lang$core$Date$Jan;
		case 2:
			return _elm_lang$core$Date$Feb;
		case 3:
			return _elm_lang$core$Date$Mar;
		case 4:
			return _elm_lang$core$Date$Apr;
		case 5:
			return _elm_lang$core$Date$May;
		case 6:
			return _elm_lang$core$Date$Jun;
		case 7:
			return _elm_lang$core$Date$Jul;
		case 8:
			return _elm_lang$core$Date$Aug;
		case 9:
			return _elm_lang$core$Date$Sep;
		case 10:
			return _elm_lang$core$Date$Oct;
		case 11:
			return _elm_lang$core$Date$Nov;
		default:
			return _elm_lang$core$Date$Dec;
	}
};
var _justinmimbs$elm_date_extra$Date_Extra_Facts$monthNumberFromMonth = function (m) {
	var _p3 = m;
	switch (_p3.ctor) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		default:
			return 12;
	}
};
var _justinmimbs$elm_date_extra$Date_Extra_Facts$months = {
	ctor: '::',
	_0: _elm_lang$core$Date$Jan,
	_1: {
		ctor: '::',
		_0: _elm_lang$core$Date$Feb,
		_1: {
			ctor: '::',
			_0: _elm_lang$core$Date$Mar,
			_1: {
				ctor: '::',
				_0: _elm_lang$core$Date$Apr,
				_1: {
					ctor: '::',
					_0: _elm_lang$core$Date$May,
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Date$Jun,
						_1: {
							ctor: '::',
							_0: _elm_lang$core$Date$Jul,
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Date$Aug,
								_1: {
									ctor: '::',
									_0: _elm_lang$core$Date$Sep,
									_1: {
										ctor: '::',
										_0: _elm_lang$core$Date$Oct,
										_1: {
											ctor: '::',
											_0: _elm_lang$core$Date$Nov,
											_1: {
												ctor: '::',
												_0: _elm_lang$core$Date$Dec,
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear = function (y) {
	return (_elm_lang$core$Native_Utils.eq(
		A2(_elm_lang$core$Basics_ops['%'], y, 4),
		0) && (!_elm_lang$core$Native_Utils.eq(
		A2(_elm_lang$core$Basics_ops['%'], y, 100),
		0))) || _elm_lang$core$Native_Utils.eq(
		A2(_elm_lang$core$Basics_ops['%'], y, 400),
		0);
};
var _justinmimbs$elm_date_extra$Date_Extra_Facts$daysInMonth = F2(
	function (y, m) {
		var _p4 = m;
		switch (_p4.ctor) {
			case 'Jan':
				return 31;
			case 'Feb':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 29 : 28;
			case 'Mar':
				return 31;
			case 'Apr':
				return 30;
			case 'May':
				return 31;
			case 'Jun':
				return 30;
			case 'Jul':
				return 31;
			case 'Aug':
				return 31;
			case 'Sep':
				return 30;
			case 'Oct':
				return 31;
			case 'Nov':
				return 30;
			default:
				return 31;
		}
	});
var _justinmimbs$elm_date_extra$Date_Extra_Facts$daysBeforeStartOfMonth = F2(
	function (y, m) {
		var _p5 = m;
		switch (_p5.ctor) {
			case 'Jan':
				return 0;
			case 'Feb':
				return 31;
			case 'Mar':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 60 : 59;
			case 'Apr':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 91 : 90;
			case 'May':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 121 : 120;
			case 'Jun':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 152 : 151;
			case 'Jul':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 182 : 181;
			case 'Aug':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 213 : 212;
			case 'Sep':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 244 : 243;
			case 'Oct':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 274 : 273;
			case 'Nov':
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 305 : 304;
			default:
				return _justinmimbs$elm_date_extra$Date_Extra_Facts$isLeapYear(y) ? 335 : 334;
		}
	});

var _justinmimbs$elm_date_extra$Date_Internal_RataDie$toUnixTime = function (rd) {
	return (rd - 719163) * _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerDay;
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$weekdayNumber = function (rd) {
	var _p0 = A2(_elm_lang$core$Basics_ops['%'], rd, 7);
	if (_p0 === 0) {
		return 7;
	} else {
		return _p0;
	}
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$leapYearsInCommonEra = function (y) {
	return (((y / 4) | 0) - ((y / 100) | 0)) + ((y / 400) | 0);
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$rataDieBeforeStartOfYear = function (y) {
	return (365 * (y - 1)) + _justinmimbs$elm_date_extra$Date_Internal_RataDie$leapYearsInCommonEra(y - 1);
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$fromOrdinalDate = F2(
	function (y, d) {
		return _justinmimbs$elm_date_extra$Date_Internal_RataDie$rataDieBeforeStartOfYear(y) + d;
	});
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$week1Day1OfWeekYear = function (y) {
	var jan4RD = A2(_justinmimbs$elm_date_extra$Date_Internal_RataDie$fromOrdinalDate, y, 4);
	return (jan4RD - _justinmimbs$elm_date_extra$Date_Internal_RataDie$weekdayNumber(jan4RD)) + 1;
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$fromWeekDate = F3(
	function (y, w, d) {
		var week1Day0RD = _justinmimbs$elm_date_extra$Date_Internal_RataDie$week1Day1OfWeekYear(y) - 1;
		return (week1Day0RD + ((w - 1) * 7)) + d;
	});
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$fromCalendarDate = F3(
	function (y, m, d) {
		var md = A2(_justinmimbs$elm_date_extra$Date_Extra_Facts$daysBeforeStartOfMonth, y, m);
		var yd = _justinmimbs$elm_date_extra$Date_Internal_RataDie$rataDieBeforeStartOfYear(y);
		return (yd + md) + d;
	});
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$divideInt = F2(
	function (a, b) {
		return {
			ctor: '_Tuple2',
			_0: (a / b) | 0,
			_1: A2(_elm_lang$core$Basics$rem, a, b)
		};
	});
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$year = function (rd) {
	var _p1 = A2(_justinmimbs$elm_date_extra$Date_Internal_RataDie$divideInt, rd, 146097);
	var q400 = _p1._0;
	var r400 = _p1._1;
	var _p2 = A2(_justinmimbs$elm_date_extra$Date_Internal_RataDie$divideInt, r400, 36524);
	var q100 = _p2._0;
	var r100 = _p2._1;
	var _p3 = A2(_justinmimbs$elm_date_extra$Date_Internal_RataDie$divideInt, r100, 1461);
	var q4 = _p3._0;
	var r4 = _p3._1;
	var _p4 = A2(_justinmimbs$elm_date_extra$Date_Internal_RataDie$divideInt, r4, 365);
	var q1 = _p4._0;
	var r1 = _p4._1;
	var n = _elm_lang$core$Native_Utils.eq(r1, 0) ? 0 : 1;
	return ((((q400 * 400) + (q100 * 100)) + (q4 * 4)) + q1) + n;
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$ordinalDay = function (rd) {
	return rd - _justinmimbs$elm_date_extra$Date_Internal_RataDie$rataDieBeforeStartOfYear(
		_justinmimbs$elm_date_extra$Date_Internal_RataDie$year(rd));
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$weekYear = function (rd) {
	var daysToThursday = 4 - _justinmimbs$elm_date_extra$Date_Internal_RataDie$weekdayNumber(rd);
	return _justinmimbs$elm_date_extra$Date_Internal_RataDie$year(rd + daysToThursday);
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$weekNumber = function (rd) {
	var week1Day1RD = _justinmimbs$elm_date_extra$Date_Internal_RataDie$week1Day1OfWeekYear(
		_justinmimbs$elm_date_extra$Date_Internal_RataDie$weekYear(rd));
	return (((rd - week1Day1RD) / 7) | 0) + 1;
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$find = F2(
	function (pred, list) {
		find:
		while (true) {
			var _p5 = list;
			if (_p5.ctor === '[]') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p6 = _p5._0;
				if (pred(_p6)) {
					return _elm_lang$core$Maybe$Just(_p6);
				} else {
					var _v2 = pred,
						_v3 = _p5._1;
					pred = _v2;
					list = _v3;
					continue find;
				}
			}
		}
	});
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$month = function (rd) {
	var od = _justinmimbs$elm_date_extra$Date_Internal_RataDie$ordinalDay(rd);
	var y = _justinmimbs$elm_date_extra$Date_Internal_RataDie$year(rd);
	return A2(
		_elm_lang$core$Maybe$withDefault,
		_elm_lang$core$Date$Jan,
		A2(
			_justinmimbs$elm_date_extra$Date_Internal_RataDie$find,
			function (m) {
				return _elm_lang$core$Native_Utils.cmp(
					A2(_justinmimbs$elm_date_extra$Date_Extra_Facts$daysBeforeStartOfMonth, y, m),
					od) < 0;
			},
			_elm_lang$core$List$reverse(_justinmimbs$elm_date_extra$Date_Extra_Facts$months)));
};
var _justinmimbs$elm_date_extra$Date_Internal_RataDie$day = function (rd) {
	var od = _justinmimbs$elm_date_extra$Date_Internal_RataDie$ordinalDay(rd);
	var m = _justinmimbs$elm_date_extra$Date_Internal_RataDie$month(rd);
	var y = _justinmimbs$elm_date_extra$Date_Internal_RataDie$year(rd);
	return od - A2(_justinmimbs$elm_date_extra$Date_Extra_Facts$daysBeforeStartOfMonth, y, m);
};

var _justinmimbs$elm_date_extra$Date_Internal_Core$weekNumberFromCalendarDate = F3(
	function (y, m, d) {
		return _justinmimbs$elm_date_extra$Date_Internal_RataDie$weekNumber(
			A3(_justinmimbs$elm_date_extra$Date_Internal_RataDie$fromCalendarDate, y, m, d));
	});
var _justinmimbs$elm_date_extra$Date_Internal_Core$weekYearFromCalendarDate = F3(
	function (y, m, d) {
		return _justinmimbs$elm_date_extra$Date_Internal_RataDie$weekYear(
			A3(_justinmimbs$elm_date_extra$Date_Internal_RataDie$fromCalendarDate, y, m, d));
	});
var _justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromOrdinalDate = F2(
	function (y, d) {
		return _justinmimbs$elm_date_extra$Date_Internal_RataDie$toUnixTime(
			A2(_justinmimbs$elm_date_extra$Date_Internal_RataDie$fromOrdinalDate, y, d));
	});
var _justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromWeekDate = F3(
	function (y, w, d) {
		return _justinmimbs$elm_date_extra$Date_Internal_RataDie$toUnixTime(
			A3(_justinmimbs$elm_date_extra$Date_Internal_RataDie$fromWeekDate, y, w, d));
	});
var _justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromCalendarDate = F3(
	function (y, m, d) {
		return _justinmimbs$elm_date_extra$Date_Internal_RataDie$toUnixTime(
			A3(_justinmimbs$elm_date_extra$Date_Internal_RataDie$fromCalendarDate, y, m, d));
	});
var _justinmimbs$elm_date_extra$Date_Internal_Core$msFromTimeParts = F4(
	function (hh, mm, ss, ms) {
		return ((ms + (_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerSecond * ss)) + (_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute * mm)) + (_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerHour * hh);
	});
var _justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromParts = F7(
	function (y, m, d, hh, mm, ss, ms) {
		return _justinmimbs$elm_date_extra$Date_Internal_RataDie$toUnixTime(
			A3(_justinmimbs$elm_date_extra$Date_Internal_RataDie$fromCalendarDate, y, m, d)) + A4(_justinmimbs$elm_date_extra$Date_Internal_Core$msFromTimeParts, hh, mm, ss, ms);
	});

var _justinmimbs$elm_date_extra$Date_Internal_Extract$msOffsetFromUtc = function (date) {
	var utcTime = _elm_lang$core$Date$toTime(date);
	var localTime = _elm_lang$core$Basics$toFloat(
		A7(
			_justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromParts,
			_elm_lang$core$Date$year(date),
			_elm_lang$core$Date$month(date),
			_elm_lang$core$Date$day(date),
			_elm_lang$core$Date$hour(date),
			_elm_lang$core$Date$minute(date),
			_elm_lang$core$Date$second(date),
			_elm_lang$core$Date$millisecond(date)));
	return _elm_lang$core$Basics$floor(localTime - utcTime);
};
var _justinmimbs$elm_date_extra$Date_Internal_Extract$offsetFromUtc = function (date) {
	return (_justinmimbs$elm_date_extra$Date_Internal_Extract$msOffsetFromUtc(date) / _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute) | 0;
};
var _justinmimbs$elm_date_extra$Date_Internal_Extract$weekYear = function (date) {
	return A3(
		_justinmimbs$elm_date_extra$Date_Internal_Core$weekYearFromCalendarDate,
		_elm_lang$core$Date$year(date),
		_elm_lang$core$Date$month(date),
		_elm_lang$core$Date$day(date));
};
var _justinmimbs$elm_date_extra$Date_Internal_Extract$weekNumber = function (date) {
	return A3(
		_justinmimbs$elm_date_extra$Date_Internal_Core$weekNumberFromCalendarDate,
		_elm_lang$core$Date$year(date),
		_elm_lang$core$Date$month(date),
		_elm_lang$core$Date$day(date));
};
var _justinmimbs$elm_date_extra$Date_Internal_Extract$weekdayNumber = function (_p0) {
	return _justinmimbs$elm_date_extra$Date_Extra_Facts$weekdayNumberFromDayOfWeek(
		_elm_lang$core$Date$dayOfWeek(_p0));
};
var _justinmimbs$elm_date_extra$Date_Internal_Extract$fractionalDay = function (date) {
	var timeOfDayMS = A4(
		_justinmimbs$elm_date_extra$Date_Internal_Core$msFromTimeParts,
		_elm_lang$core$Date$hour(date),
		_elm_lang$core$Date$minute(date),
		_elm_lang$core$Date$second(date),
		_elm_lang$core$Date$millisecond(date));
	return _elm_lang$core$Basics$toFloat(timeOfDayMS) / _elm_lang$core$Basics$toFloat(_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerDay);
};
var _justinmimbs$elm_date_extra$Date_Internal_Extract$ordinalDay = function (date) {
	return A2(
		_justinmimbs$elm_date_extra$Date_Extra_Facts$daysBeforeStartOfMonth,
		_elm_lang$core$Date$year(date),
		_elm_lang$core$Date$month(date)) + _elm_lang$core$Date$day(date);
};
var _justinmimbs$elm_date_extra$Date_Internal_Extract$monthNumber = function (_p1) {
	return _justinmimbs$elm_date_extra$Date_Extra_Facts$monthNumberFromMonth(
		_elm_lang$core$Date$month(_p1));
};
var _justinmimbs$elm_date_extra$Date_Internal_Extract$quarter = function (date) {
	return _elm_lang$core$Basics$ceiling(
		function (n) {
			return n / 3;
		}(
			_elm_lang$core$Basics$toFloat(
				_justinmimbs$elm_date_extra$Date_Internal_Extract$monthNumber(date))));
};

var _justinmimbs$elm_date_extra$Date_Internal_Format$toUtc = function (date) {
	return _elm_lang$core$Date$fromTime(
		_elm_lang$core$Date$toTime(date) - _elm_lang$core$Basics$toFloat(
			_justinmimbs$elm_date_extra$Date_Internal_Extract$offsetFromUtc(date) * _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute));
};
var _justinmimbs$elm_date_extra$Date_Internal_Format$nameForm = function (length) {
	var _p0 = length;
	switch (_p0) {
		case 1:
			return 'abbreviated';
		case 2:
			return 'abbreviated';
		case 3:
			return 'abbreviated';
		case 4:
			return 'full';
		case 5:
			return 'narrow';
		case 6:
			return 'short';
		default:
			return 'invalid';
	}
};
var _justinmimbs$elm_date_extra$Date_Internal_Format$patternMatches = _elm_lang$core$Regex$regex('([yYQMwdDEeabhHmsSXx])\\1*|\'(?:[^\']|\'\')*?\'(?!\')');
var _justinmimbs$elm_date_extra$Date_Internal_Format$formatTimeOffset = F3(
	function (separator, minutesOptional, offset) {
		var mm = A3(
			_elm_lang$core$String$padLeft,
			2,
			_elm_lang$core$Native_Utils.chr('0'),
			_elm_lang$core$Basics$toString(
				A2(
					_elm_lang$core$Basics_ops['%'],
					_elm_lang$core$Basics$abs(offset),
					60)));
		var hh = A3(
			_elm_lang$core$String$padLeft,
			2,
			_elm_lang$core$Native_Utils.chr('0'),
			_elm_lang$core$Basics$toString(
				(_elm_lang$core$Basics$abs(offset) / 60) | 0));
		var sign = (_elm_lang$core$Native_Utils.cmp(offset, 0) > -1) ? '+' : '-';
		return (minutesOptional && _elm_lang$core$Native_Utils.eq(mm, '00')) ? A2(_elm_lang$core$Basics_ops['++'], sign, hh) : A2(
			_elm_lang$core$Basics_ops['++'],
			sign,
			A2(
				_elm_lang$core$Basics_ops['++'],
				hh,
				A2(_elm_lang$core$Basics_ops['++'], separator, mm)));
	});
var _justinmimbs$elm_date_extra$Date_Internal_Format$ordinalSuffix = function (n) {
	var nn = A2(_elm_lang$core$Basics_ops['%'], n, 100);
	var _p1 = A2(
		_elm_lang$core$Basics$min,
		(_elm_lang$core$Native_Utils.cmp(nn, 20) < 0) ? nn : A2(_elm_lang$core$Basics_ops['%'], nn, 10),
		4);
	switch (_p1) {
		case 0:
			return 'th';
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		case 4:
			return 'th';
		default:
			return '';
	}
};
var _justinmimbs$elm_date_extra$Date_Internal_Format$withOrdinalSuffix = function (n) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_elm_lang$core$Basics$toString(n),
		_justinmimbs$elm_date_extra$Date_Internal_Format$ordinalSuffix(n));
};
var _justinmimbs$elm_date_extra$Date_Internal_Format$hour12 = function (date) {
	var _p2 = A2(
		_elm_lang$core$Basics_ops['%'],
		_elm_lang$core$Date$hour(date),
		12);
	if (_p2 === 0) {
		return 12;
	} else {
		return _p2;
	}
};
var _justinmimbs$elm_date_extra$Date_Internal_Format$dayOfWeekName = function (d) {
	var _p3 = d;
	switch (_p3.ctor) {
		case 'Mon':
			return 'Monday';
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Fri':
			return 'Friday';
		case 'Sat':
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var _justinmimbs$elm_date_extra$Date_Internal_Format$monthName = function (m) {
	var _p4 = m;
	switch (_p4.ctor) {
		case 'Jan':
			return 'January';
		case 'Feb':
			return 'February';
		case 'Mar':
			return 'March';
		case 'Apr':
			return 'April';
		case 'May':
			return 'May';
		case 'Jun':
			return 'June';
		case 'Jul':
			return 'July';
		case 'Aug':
			return 'August';
		case 'Sep':
			return 'September';
		case 'Oct':
			return 'October';
		case 'Nov':
			return 'November';
		default:
			return 'December';
	}
};
var _justinmimbs$elm_date_extra$Date_Internal_Format$PM = {ctor: 'PM'};
var _justinmimbs$elm_date_extra$Date_Internal_Format$Noon = {ctor: 'Noon'};
var _justinmimbs$elm_date_extra$Date_Internal_Format$AM = {ctor: 'AM'};
var _justinmimbs$elm_date_extra$Date_Internal_Format$Midnight = {ctor: 'Midnight'};
var _justinmimbs$elm_date_extra$Date_Internal_Format$dayPeriod = function (date) {
	var onTheHour = _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Date$minute(date),
		0) && (_elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Date$second(date),
		0) && _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Date$millisecond(date),
		0));
	var hh = _elm_lang$core$Date$hour(date);
	return (_elm_lang$core$Native_Utils.eq(hh, 0) && onTheHour) ? _justinmimbs$elm_date_extra$Date_Internal_Format$Midnight : ((_elm_lang$core$Native_Utils.cmp(hh, 12) < 0) ? _justinmimbs$elm_date_extra$Date_Internal_Format$AM : ((_elm_lang$core$Native_Utils.eq(hh, 12) && onTheHour) ? _justinmimbs$elm_date_extra$Date_Internal_Format$Noon : _justinmimbs$elm_date_extra$Date_Internal_Format$PM));
};
var _justinmimbs$elm_date_extra$Date_Internal_Format$format = F3(
	function (asUtc, date, match) {
		format:
		while (true) {
			var length = _elm_lang$core$String$length(match);
			var $char = A2(_elm_lang$core$String$left, 1, match);
			var _p5 = $char;
			switch (_p5) {
				case 'y':
					var _p6 = length;
					if (_p6 === 2) {
						return A2(
							_elm_lang$core$String$right,
							2,
							A3(
								_elm_lang$core$String$padLeft,
								length,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_elm_lang$core$Date$year(date))));
					} else {
						return A3(
							_elm_lang$core$String$padLeft,
							length,
							_elm_lang$core$Native_Utils.chr('0'),
							_elm_lang$core$Basics$toString(
								_elm_lang$core$Date$year(date)));
					}
				case 'Y':
					var _p7 = length;
					if (_p7 === 2) {
						return A2(
							_elm_lang$core$String$right,
							2,
							A3(
								_elm_lang$core$String$padLeft,
								length,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_justinmimbs$elm_date_extra$Date_Internal_Extract$weekYear(date))));
					} else {
						return A3(
							_elm_lang$core$String$padLeft,
							length,
							_elm_lang$core$Native_Utils.chr('0'),
							_elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$weekYear(date)));
					}
				case 'Q':
					var _p8 = length;
					switch (_p8) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$quarter(date));
						case 2:
							return _elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$quarter(date));
						case 3:
							return A2(
								F2(
									function (x, y) {
										return A2(_elm_lang$core$Basics_ops['++'], x, y);
									}),
								'Q',
								_elm_lang$core$Basics$toString(
									_justinmimbs$elm_date_extra$Date_Internal_Extract$quarter(date)));
						case 4:
							return _justinmimbs$elm_date_extra$Date_Internal_Format$withOrdinalSuffix(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$quarter(date));
						case 5:
							return _elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$quarter(date));
						default:
							return '';
					}
				case 'M':
					var _p9 = length;
					switch (_p9) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$monthNumber(date));
						case 2:
							return A3(
								_elm_lang$core$String$padLeft,
								2,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_justinmimbs$elm_date_extra$Date_Internal_Extract$monthNumber(date)));
						case 3:
							return A2(
								_elm_lang$core$String$left,
								3,
								_justinmimbs$elm_date_extra$Date_Internal_Format$monthName(
									_elm_lang$core$Date$month(date)));
						case 4:
							return _justinmimbs$elm_date_extra$Date_Internal_Format$monthName(
								_elm_lang$core$Date$month(date));
						case 5:
							return A2(
								_elm_lang$core$String$left,
								1,
								_justinmimbs$elm_date_extra$Date_Internal_Format$monthName(
									_elm_lang$core$Date$month(date)));
						default:
							return '';
					}
				case 'w':
					var _p10 = length;
					switch (_p10) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$weekNumber(date));
						case 2:
							return A3(
								_elm_lang$core$String$padLeft,
								2,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_justinmimbs$elm_date_extra$Date_Internal_Extract$weekNumber(date)));
						default:
							return '';
					}
				case 'd':
					var _p11 = length;
					switch (_p11) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_elm_lang$core$Date$day(date));
						case 2:
							return A3(
								_elm_lang$core$String$padLeft,
								2,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_elm_lang$core$Date$day(date)));
						case 3:
							return _justinmimbs$elm_date_extra$Date_Internal_Format$withOrdinalSuffix(
								_elm_lang$core$Date$day(date));
						default:
							return '';
					}
				case 'D':
					var _p12 = length;
					switch (_p12) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$ordinalDay(date));
						case 2:
							return A3(
								_elm_lang$core$String$padLeft,
								2,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_justinmimbs$elm_date_extra$Date_Internal_Extract$ordinalDay(date)));
						case 3:
							return A3(
								_elm_lang$core$String$padLeft,
								3,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_justinmimbs$elm_date_extra$Date_Internal_Extract$ordinalDay(date)));
						default:
							return '';
					}
				case 'E':
					var _p13 = _justinmimbs$elm_date_extra$Date_Internal_Format$nameForm(length);
					switch (_p13) {
						case 'abbreviated':
							return A2(
								_elm_lang$core$String$left,
								3,
								_justinmimbs$elm_date_extra$Date_Internal_Format$dayOfWeekName(
									_elm_lang$core$Date$dayOfWeek(date)));
						case 'full':
							return _justinmimbs$elm_date_extra$Date_Internal_Format$dayOfWeekName(
								_elm_lang$core$Date$dayOfWeek(date));
						case 'narrow':
							return A2(
								_elm_lang$core$String$left,
								1,
								_justinmimbs$elm_date_extra$Date_Internal_Format$dayOfWeekName(
									_elm_lang$core$Date$dayOfWeek(date)));
						case 'short':
							return A2(
								_elm_lang$core$String$left,
								2,
								_justinmimbs$elm_date_extra$Date_Internal_Format$dayOfWeekName(
									_elm_lang$core$Date$dayOfWeek(date)));
						default:
							return '';
					}
				case 'e':
					var _p14 = length;
					switch (_p14) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$weekdayNumber(date));
						case 2:
							return _elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Extract$weekdayNumber(date));
						default:
							var _v15 = asUtc,
								_v16 = date,
								_v17 = _elm_lang$core$String$toUpper(match);
							asUtc = _v15;
							date = _v16;
							match = _v17;
							continue format;
					}
				case 'a':
					var p = _justinmimbs$elm_date_extra$Date_Internal_Format$dayPeriod(date);
					var m = (_elm_lang$core$Native_Utils.eq(p, _justinmimbs$elm_date_extra$Date_Internal_Format$Midnight) || _elm_lang$core$Native_Utils.eq(p, _justinmimbs$elm_date_extra$Date_Internal_Format$AM)) ? 'A' : 'P';
					var _p15 = _justinmimbs$elm_date_extra$Date_Internal_Format$nameForm(length);
					switch (_p15) {
						case 'abbreviated':
							return A2(_elm_lang$core$Basics_ops['++'], m, 'M');
						case 'full':
							return A2(_elm_lang$core$Basics_ops['++'], m, '.M.');
						case 'narrow':
							return m;
						default:
							return '';
					}
				case 'b':
					var _p16 = _justinmimbs$elm_date_extra$Date_Internal_Format$nameForm(length);
					switch (_p16) {
						case 'abbreviated':
							var _p17 = _justinmimbs$elm_date_extra$Date_Internal_Format$dayPeriod(date);
							switch (_p17.ctor) {
								case 'Midnight':
									return 'mid.';
								case 'AM':
									return 'am';
								case 'Noon':
									return 'noon';
								default:
									return 'pm';
							}
						case 'full':
							var _p18 = _justinmimbs$elm_date_extra$Date_Internal_Format$dayPeriod(date);
							switch (_p18.ctor) {
								case 'Midnight':
									return 'midnight';
								case 'AM':
									return 'a.m.';
								case 'Noon':
									return 'noon';
								default:
									return 'p.m.';
							}
						case 'narrow':
							var _p19 = _justinmimbs$elm_date_extra$Date_Internal_Format$dayPeriod(date);
							switch (_p19.ctor) {
								case 'Midnight':
									return 'md';
								case 'AM':
									return 'a';
								case 'Noon':
									return 'nn';
								default:
									return 'p';
							}
						default:
							return '';
					}
				case 'h':
					var _p20 = length;
					switch (_p20) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_justinmimbs$elm_date_extra$Date_Internal_Format$hour12(date));
						case 2:
							return A3(
								_elm_lang$core$String$padLeft,
								2,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_justinmimbs$elm_date_extra$Date_Internal_Format$hour12(date)));
						default:
							return '';
					}
				case 'H':
					var _p21 = length;
					switch (_p21) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_elm_lang$core$Date$hour(date));
						case 2:
							return A3(
								_elm_lang$core$String$padLeft,
								2,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_elm_lang$core$Date$hour(date)));
						default:
							return '';
					}
				case 'm':
					var _p22 = length;
					switch (_p22) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_elm_lang$core$Date$minute(date));
						case 2:
							return A3(
								_elm_lang$core$String$padLeft,
								2,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_elm_lang$core$Date$minute(date)));
						default:
							return '';
					}
				case 's':
					var _p23 = length;
					switch (_p23) {
						case 1:
							return _elm_lang$core$Basics$toString(
								_elm_lang$core$Date$second(date));
						case 2:
							return A3(
								_elm_lang$core$String$padLeft,
								2,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_elm_lang$core$Date$second(date)));
						default:
							return '';
					}
				case 'S':
					return A3(
						_elm_lang$core$String$padRight,
						length,
						_elm_lang$core$Native_Utils.chr('0'),
						A2(
							_elm_lang$core$String$left,
							length,
							A3(
								_elm_lang$core$String$padLeft,
								3,
								_elm_lang$core$Native_Utils.chr('0'),
								_elm_lang$core$Basics$toString(
									_elm_lang$core$Date$millisecond(date)))));
				case 'X':
					if ((_elm_lang$core$Native_Utils.cmp(length, 4) < 0) && (asUtc || _elm_lang$core$Native_Utils.eq(
						_justinmimbs$elm_date_extra$Date_Internal_Extract$offsetFromUtc(date),
						0))) {
						return 'Z';
					} else {
						var _v27 = asUtc,
							_v28 = date,
							_v29 = _elm_lang$core$String$toLower(match);
						asUtc = _v27;
						date = _v28;
						match = _v29;
						continue format;
					}
				case 'x':
					var offset = asUtc ? 0 : _justinmimbs$elm_date_extra$Date_Internal_Extract$offsetFromUtc(date);
					var _p24 = length;
					switch (_p24) {
						case 1:
							return A3(_justinmimbs$elm_date_extra$Date_Internal_Format$formatTimeOffset, '', true, offset);
						case 2:
							return A3(_justinmimbs$elm_date_extra$Date_Internal_Format$formatTimeOffset, '', false, offset);
						case 3:
							return A3(_justinmimbs$elm_date_extra$Date_Internal_Format$formatTimeOffset, ':', false, offset);
						default:
							return '';
					}
				case '\'':
					return _elm_lang$core$Native_Utils.eq(match, '\'\'') ? '\'' : A4(
						_elm_lang$core$Regex$replace,
						_elm_lang$core$Regex$All,
						_elm_lang$core$Regex$regex('\'\''),
						function (_p25) {
							return '\'';
						},
						A3(_elm_lang$core$String$slice, 1, -1, match));
				default:
					return '';
			}
		}
	});
var _justinmimbs$elm_date_extra$Date_Internal_Format$toFormattedString = F3(
	function (asUtc, pattern, date) {
		var date_ = asUtc ? _justinmimbs$elm_date_extra$Date_Internal_Format$toUtc(date) : date;
		return A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$All,
			_justinmimbs$elm_date_extra$Date_Internal_Format$patternMatches,
			function (_p26) {
				return A3(
					_justinmimbs$elm_date_extra$Date_Internal_Format$format,
					asUtc,
					date_,
					function (_) {
						return _.match;
					}(_p26));
			},
			pattern);
	});

var _justinmimbs$elm_date_extra$Date_Internal_Parse$isoDateRegex = function () {
	var time = 'T(\\d{2})(?:(\\:)?(\\d{2})(?:\\10(\\d{2}))?)?(\\.\\d+)?(?:(Z)|(?:([+\\-])(\\d{2})(?:\\:?(\\d{2}))?))?';
	var ord = '\\-?(\\d{3})';
	var week = '(\\-)?W(\\d{2})(?:\\5(\\d))?';
	var cal = '(\\-)?(\\d{2})(?:\\2(\\d{2}))?';
	var year = '(\\d{4})';
	return _elm_lang$core$Regex$regex(
		A2(
			_elm_lang$core$Basics_ops['++'],
			'^',
			A2(
				_elm_lang$core$Basics_ops['++'],
				year,
				A2(
					_elm_lang$core$Basics_ops['++'],
					'(?:',
					A2(
						_elm_lang$core$Basics_ops['++'],
						cal,
						A2(
							_elm_lang$core$Basics_ops['++'],
							'|',
							A2(
								_elm_lang$core$Basics_ops['++'],
								week,
								A2(
									_elm_lang$core$Basics_ops['++'],
									'|',
									A2(
										_elm_lang$core$Basics_ops['++'],
										ord,
										A2(
											_elm_lang$core$Basics_ops['++'],
											')?',
											A2(
												_elm_lang$core$Basics_ops['++'],
												'(?:',
												A2(_elm_lang$core$Basics_ops['++'], time, ')?$'))))))))))));
}();
var _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToFloat = function (_p0) {
	return _elm_lang$core$Result$toMaybe(
		_elm_lang$core$String$toFloat(_p0));
};
var _justinmimbs$elm_date_extra$Date_Internal_Parse$msFromMatches = F4(
	function (timeHH, timeMM, timeSS, timeF) {
		var fractional = A2(
			_elm_lang$core$Maybe$withDefault,
			0.0,
			A2(_elm_lang$core$Maybe$andThen, _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToFloat, timeF));
		var _p1 = function () {
			var _p2 = A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Maybe$andThen(_justinmimbs$elm_date_extra$Date_Internal_Parse$stringToFloat),
				{
					ctor: '::',
					_0: timeHH,
					_1: {
						ctor: '::',
						_0: timeMM,
						_1: {
							ctor: '::',
							_0: timeSS,
							_1: {ctor: '[]'}
						}
					}
				});
			_v0_3:
			do {
				if (((_p2.ctor === '::') && (_p2._0.ctor === 'Just')) && (_p2._1.ctor === '::')) {
					if (_p2._1._0.ctor === 'Just') {
						if (_p2._1._1.ctor === '::') {
							if (_p2._1._1._0.ctor === 'Just') {
								if (_p2._1._1._1.ctor === '[]') {
									return {ctor: '_Tuple3', _0: _p2._0._0, _1: _p2._1._0._0, _2: _p2._1._1._0._0 + fractional};
								} else {
									break _v0_3;
								}
							} else {
								if (_p2._1._1._1.ctor === '[]') {
									return {ctor: '_Tuple3', _0: _p2._0._0, _1: _p2._1._0._0 + fractional, _2: 0.0};
								} else {
									break _v0_3;
								}
							}
						} else {
							break _v0_3;
						}
					} else {
						if (((_p2._1._1.ctor === '::') && (_p2._1._1._0.ctor === 'Nothing')) && (_p2._1._1._1.ctor === '[]')) {
							return {ctor: '_Tuple3', _0: _p2._0._0 + fractional, _1: 0.0, _2: 0.0};
						} else {
							break _v0_3;
						}
					}
				} else {
					break _v0_3;
				}
			} while(false);
			return {ctor: '_Tuple3', _0: 0.0, _1: 0.0, _2: 0.0};
		}();
		var hh = _p1._0;
		var mm = _p1._1;
		var ss = _p1._2;
		return _elm_lang$core$Basics$round(
			((hh * _elm_lang$core$Basics$toFloat(_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerHour)) + (mm * _elm_lang$core$Basics$toFloat(_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute))) + (ss * _elm_lang$core$Basics$toFloat(_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerSecond)));
	});
var _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToInt = function (_p3) {
	return _elm_lang$core$Result$toMaybe(
		_elm_lang$core$String$toInt(_p3));
};
var _justinmimbs$elm_date_extra$Date_Internal_Parse$unixTimeFromMatches = F6(
	function (yyyy, calMM, calDD, weekWW, weekD, ordDDD) {
		var y = A2(
			_elm_lang$core$Maybe$withDefault,
			1,
			_justinmimbs$elm_date_extra$Date_Internal_Parse$stringToInt(yyyy));
		var _p4 = {ctor: '_Tuple2', _0: calMM, _1: weekWW};
		_v1_2:
		do {
			if (_p4.ctor === '_Tuple2') {
				if (_p4._0.ctor === 'Just') {
					if (_p4._1.ctor === 'Nothing') {
						return A3(
							_justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromCalendarDate,
							y,
							_justinmimbs$elm_date_extra$Date_Extra_Facts$monthFromMonthNumber(
								A2(
									_elm_lang$core$Maybe$withDefault,
									1,
									A2(_elm_lang$core$Maybe$andThen, _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToInt, calMM))),
							A2(
								_elm_lang$core$Maybe$withDefault,
								1,
								A2(_elm_lang$core$Maybe$andThen, _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToInt, calDD)));
					} else {
						break _v1_2;
					}
				} else {
					if (_p4._1.ctor === 'Just') {
						return A3(
							_justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromWeekDate,
							y,
							A2(
								_elm_lang$core$Maybe$withDefault,
								1,
								A2(_elm_lang$core$Maybe$andThen, _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToInt, weekWW)),
							A2(
								_elm_lang$core$Maybe$withDefault,
								1,
								A2(_elm_lang$core$Maybe$andThen, _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToInt, weekD)));
					} else {
						break _v1_2;
					}
				}
			} else {
				break _v1_2;
			}
		} while(false);
		return A2(
			_justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromOrdinalDate,
			y,
			A2(
				_elm_lang$core$Maybe$withDefault,
				1,
				A2(_elm_lang$core$Maybe$andThen, _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToInt, ordDDD)));
	});
var _justinmimbs$elm_date_extra$Date_Internal_Parse$offsetFromMatches = F4(
	function (tzZ, tzSign, tzHH, tzMM) {
		var _p5 = {ctor: '_Tuple2', _0: tzZ, _1: tzSign};
		_v2_2:
		do {
			if (_p5.ctor === '_Tuple2') {
				if (_p5._0.ctor === 'Just') {
					if ((_p5._0._0 === 'Z') && (_p5._1.ctor === 'Nothing')) {
						return _elm_lang$core$Maybe$Just(0);
					} else {
						break _v2_2;
					}
				} else {
					if (_p5._1.ctor === 'Just') {
						var mm = A2(
							_elm_lang$core$Maybe$withDefault,
							0,
							A2(_elm_lang$core$Maybe$andThen, _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToInt, tzMM));
						var hh = A2(
							_elm_lang$core$Maybe$withDefault,
							0,
							A2(_elm_lang$core$Maybe$andThen, _justinmimbs$elm_date_extra$Date_Internal_Parse$stringToInt, tzHH));
						return _elm_lang$core$Maybe$Just(
							(_elm_lang$core$Native_Utils.eq(_p5._1._0, '+') ? 1 : -1) * ((hh * 60) + mm));
					} else {
						break _v2_2;
					}
				}
			} else {
				break _v2_2;
			}
		} while(false);
		return _elm_lang$core$Maybe$Nothing;
	});
var _justinmimbs$elm_date_extra$Date_Internal_Parse$offsetTimeFromMatches = function (matches) {
	var _p6 = matches;
	if (((((((((((((((((((_p6.ctor === '::') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === '::')) && (_p6._1._1.ctor === '::')) && (_p6._1._1._1.ctor === '::')) && (_p6._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1.ctor === '::')) && (_p6._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1.ctor === '[]')) {
		var offset = A4(_justinmimbs$elm_date_extra$Date_Internal_Parse$offsetFromMatches, _p6._1._1._1._1._1._1._1._1._1._1._1._1._1._0, _p6._1._1._1._1._1._1._1._1._1._1._1._1._1._1._0, _p6._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1._0, _p6._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1._0);
		var timeMS = A4(_justinmimbs$elm_date_extra$Date_Internal_Parse$msFromMatches, _p6._1._1._1._1._1._1._1._1._0, _p6._1._1._1._1._1._1._1._1._1._1._0, _p6._1._1._1._1._1._1._1._1._1._1._1._0, _p6._1._1._1._1._1._1._1._1._1._1._1._1._0);
		var dateMS = A6(_justinmimbs$elm_date_extra$Date_Internal_Parse$unixTimeFromMatches, _p6._0._0, _p6._1._1._0, _p6._1._1._1._0, _p6._1._1._1._1._1._0, _p6._1._1._1._1._1._1._0, _p6._1._1._1._1._1._1._1._0);
		return _elm_lang$core$Maybe$Just(
			{ctor: '_Tuple2', _0: offset, _1: dateMS + timeMS});
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _justinmimbs$elm_date_extra$Date_Internal_Parse$offsetTimeFromIsoString = function (s) {
	return A2(
		_elm_lang$core$Maybe$andThen,
		_justinmimbs$elm_date_extra$Date_Internal_Parse$offsetTimeFromMatches,
		A2(
			_elm_lang$core$Maybe$map,
			function (_) {
				return _.submatches;
			},
			_elm_lang$core$List$head(
				A3(
					_elm_lang$core$Regex$find,
					_elm_lang$core$Regex$AtMost(1),
					_justinmimbs$elm_date_extra$Date_Internal_Parse$isoDateRegex,
					s))));
};

var _justinmimbs$elm_date_extra$Date_Extra$toParts = function (date) {
	return {
		ctor: '_Tuple7',
		_0: _elm_lang$core$Date$year(date),
		_1: _elm_lang$core$Date$month(date),
		_2: _elm_lang$core$Date$day(date),
		_3: _elm_lang$core$Date$hour(date),
		_4: _elm_lang$core$Date$minute(date),
		_5: _elm_lang$core$Date$second(date),
		_6: _elm_lang$core$Date$millisecond(date)
	};
};
var _justinmimbs$elm_date_extra$Date_Extra$monthFromQuarter = function (q) {
	var _p0 = q;
	switch (_p0) {
		case 1:
			return _elm_lang$core$Date$Jan;
		case 2:
			return _elm_lang$core$Date$Apr;
		case 3:
			return _elm_lang$core$Date$Jul;
		default:
			return _elm_lang$core$Date$Oct;
	}
};
var _justinmimbs$elm_date_extra$Date_Extra$clamp = F3(
	function (min, max, date) {
		return (_elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$Date$toTime(date),
			_elm_lang$core$Date$toTime(min)) < 0) ? min : ((_elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$Date$toTime(date),
			_elm_lang$core$Date$toTime(max)) > 0) ? max : date);
	});
var _justinmimbs$elm_date_extra$Date_Extra$comparableIsBetween = F3(
	function (a, b, x) {
		return ((_elm_lang$core$Native_Utils.cmp(a, x) < 1) && (_elm_lang$core$Native_Utils.cmp(x, b) < 1)) || ((_elm_lang$core$Native_Utils.cmp(b, x) < 1) && (_elm_lang$core$Native_Utils.cmp(x, a) < 1));
	});
var _justinmimbs$elm_date_extra$Date_Extra$isBetween = F3(
	function (date1, date2, date) {
		return A3(
			_justinmimbs$elm_date_extra$Date_Extra$comparableIsBetween,
			_elm_lang$core$Date$toTime(date1),
			_elm_lang$core$Date$toTime(date2),
			_elm_lang$core$Date$toTime(date));
	});
var _justinmimbs$elm_date_extra$Date_Extra$compare = F2(
	function (a, b) {
		return A2(
			_elm_lang$core$Basics$compare,
			_elm_lang$core$Date$toTime(a),
			_elm_lang$core$Date$toTime(b));
	});
var _justinmimbs$elm_date_extra$Date_Extra$equal = F2(
	function (a, b) {
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$Date$toTime(a),
			_elm_lang$core$Date$toTime(b));
	});
var _justinmimbs$elm_date_extra$Date_Extra$offsetFromUtc = _justinmimbs$elm_date_extra$Date_Internal_Extract$offsetFromUtc;
var _justinmimbs$elm_date_extra$Date_Extra$weekYear = _justinmimbs$elm_date_extra$Date_Internal_Extract$weekYear;
var _justinmimbs$elm_date_extra$Date_Extra$weekNumber = _justinmimbs$elm_date_extra$Date_Internal_Extract$weekNumber;
var _justinmimbs$elm_date_extra$Date_Extra$weekdayNumber = _justinmimbs$elm_date_extra$Date_Internal_Extract$weekdayNumber;
var _justinmimbs$elm_date_extra$Date_Extra$daysToPreviousDayOfWeek = F2(
	function (d, date) {
		return _elm_lang$core$Basics$negate(
			A2(
				_elm_lang$core$Basics_ops['%'],
				(_justinmimbs$elm_date_extra$Date_Extra$weekdayNumber(date) - _justinmimbs$elm_date_extra$Date_Extra_Facts$weekdayNumberFromDayOfWeek(d)) + 7,
				7));
	});
var _justinmimbs$elm_date_extra$Date_Extra$fractionalDay = _justinmimbs$elm_date_extra$Date_Internal_Extract$fractionalDay;
var _justinmimbs$elm_date_extra$Date_Extra$ordinalDay = _justinmimbs$elm_date_extra$Date_Internal_Extract$ordinalDay;
var _justinmimbs$elm_date_extra$Date_Extra$quarter = _justinmimbs$elm_date_extra$Date_Internal_Extract$quarter;
var _justinmimbs$elm_date_extra$Date_Extra$monthNumber = _justinmimbs$elm_date_extra$Date_Internal_Extract$monthNumber;
var _justinmimbs$elm_date_extra$Date_Extra$ordinalMonth = function (date) {
	return (_elm_lang$core$Date$year(date) * 12) + _justinmimbs$elm_date_extra$Date_Extra$monthNumber(date);
};
var _justinmimbs$elm_date_extra$Date_Extra$diffMonth = F2(
	function (date1, date2) {
		var fractionalMonth = function (date) {
			return (_elm_lang$core$Basics$toFloat(
				_elm_lang$core$Date$day(date) - 1) + _justinmimbs$elm_date_extra$Date_Extra$fractionalDay(date)) / 31;
		};
		var ordinalMonthFloat = function (date) {
			return _elm_lang$core$Basics$toFloat(
				_justinmimbs$elm_date_extra$Date_Extra$ordinalMonth(date)) + fractionalMonth(date);
		};
		return _elm_lang$core$Basics$truncate(
			ordinalMonthFloat(date2) - ordinalMonthFloat(date1));
	});
var _justinmimbs$elm_date_extra$Date_Extra$toUtcFormattedString = _justinmimbs$elm_date_extra$Date_Internal_Format$toFormattedString(true);
var _justinmimbs$elm_date_extra$Date_Extra$toUtcIsoString = _justinmimbs$elm_date_extra$Date_Extra$toUtcFormattedString('yyyy-MM-dd\'T\'HH:mm:ss.SSSXXX');
var _justinmimbs$elm_date_extra$Date_Extra$toFormattedString = _justinmimbs$elm_date_extra$Date_Internal_Format$toFormattedString(false);
var _justinmimbs$elm_date_extra$Date_Extra$toIsoString = _justinmimbs$elm_date_extra$Date_Extra$toFormattedString('yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx');
var _justinmimbs$elm_date_extra$Date_Extra$fromTime = function (_p1) {
	return _elm_lang$core$Date$fromTime(
		_elm_lang$core$Basics$toFloat(_p1));
};
var _justinmimbs$elm_date_extra$Date_Extra$fromOffsetTime = function (_p2) {
	var _p3 = _p2;
	var _p5 = _p3._1;
	var _p4 = _p3._0;
	if (_p4.ctor === 'Just') {
		return _justinmimbs$elm_date_extra$Date_Extra$fromTime(_p5 - (_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute * _p4._0));
	} else {
		var offset0 = _justinmimbs$elm_date_extra$Date_Extra$offsetFromUtc(
			_justinmimbs$elm_date_extra$Date_Extra$fromTime(_p5));
		var date1 = _justinmimbs$elm_date_extra$Date_Extra$fromTime(_p5 - (_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute * offset0));
		var offset1 = _justinmimbs$elm_date_extra$Date_Extra$offsetFromUtc(date1);
		if (_elm_lang$core$Native_Utils.eq(offset0, offset1)) {
			return date1;
		} else {
			var date2 = _justinmimbs$elm_date_extra$Date_Extra$fromTime(_p5 - (_justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute * offset1));
			var offset2 = _justinmimbs$elm_date_extra$Date_Extra$offsetFromUtc(date2);
			return _elm_lang$core$Native_Utils.eq(offset1, offset2) ? date2 : date1;
		}
	}
};
var _justinmimbs$elm_date_extra$Date_Extra$fromParts = F7(
	function (y, m, d, hh, mm, ss, ms) {
		return _justinmimbs$elm_date_extra$Date_Extra$fromOffsetTime(
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Maybe$Nothing,
				_1: A7(_justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromParts, y, m, d, hh, mm, ss, ms)
			});
	});
var _justinmimbs$elm_date_extra$Date_Extra$addMonths = F2(
	function (n, date) {
		var om = (_justinmimbs$elm_date_extra$Date_Extra$ordinalMonth(date) + n) + -1;
		var y_ = (om / 12) | 0;
		var m_ = _justinmimbs$elm_date_extra$Date_Extra_Facts$monthFromMonthNumber(
			A2(_elm_lang$core$Basics_ops['%'], om, 12) + 1);
		var _p6 = _justinmimbs$elm_date_extra$Date_Extra$toParts(date);
		var y = _p6._0;
		var m = _p6._1;
		var d = _p6._2;
		var hh = _p6._3;
		var mm = _p6._4;
		var ss = _p6._5;
		var ms = _p6._6;
		var d_ = A2(
			_elm_lang$core$Basics$min,
			d,
			A2(_justinmimbs$elm_date_extra$Date_Extra_Facts$daysInMonth, y_, m_));
		return A7(_justinmimbs$elm_date_extra$Date_Extra$fromParts, y_, m_, d_, hh, mm, ss, ms);
	});
var _justinmimbs$elm_date_extra$Date_Extra$add = F3(
	function (interval, n, date) {
		var _p7 = _justinmimbs$elm_date_extra$Date_Extra$toParts(date);
		var y = _p7._0;
		var m = _p7._1;
		var d = _p7._2;
		var hh = _p7._3;
		var mm = _p7._4;
		var ss = _p7._5;
		var ms = _p7._6;
		var _p8 = interval;
		switch (_p8.ctor) {
			case 'Millisecond':
				return _elm_lang$core$Date$fromTime(
					_elm_lang$core$Date$toTime(date) + _elm_lang$core$Basics$toFloat(n));
			case 'Second':
				return _elm_lang$core$Date$fromTime(
					_elm_lang$core$Date$toTime(date) + _elm_lang$core$Basics$toFloat(n * _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerSecond));
			case 'Minute':
				return _elm_lang$core$Date$fromTime(
					_elm_lang$core$Date$toTime(date) + _elm_lang$core$Basics$toFloat(n * _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute));
			case 'Hour':
				return _elm_lang$core$Date$fromTime(
					_elm_lang$core$Date$toTime(date) + _elm_lang$core$Basics$toFloat(n * _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerHour));
			case 'Day':
				return A7(_justinmimbs$elm_date_extra$Date_Extra$fromParts, y, m, d + n, hh, mm, ss, ms);
			case 'Month':
				return A2(_justinmimbs$elm_date_extra$Date_Extra$addMonths, n, date);
			case 'Year':
				return A2(_justinmimbs$elm_date_extra$Date_Extra$addMonths, n * 12, date);
			case 'Quarter':
				return A2(_justinmimbs$elm_date_extra$Date_Extra$addMonths, n * 3, date);
			case 'Week':
				return A7(_justinmimbs$elm_date_extra$Date_Extra$fromParts, y, m, d + (n * 7), hh, mm, ss, ms);
			default:
				return A7(_justinmimbs$elm_date_extra$Date_Extra$fromParts, y, m, d + (n * 7), hh, mm, ss, ms);
		}
	});
var _justinmimbs$elm_date_extra$Date_Extra$rangeHelp = F5(
	function (result, interval, step, start, date) {
		rangeHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(
				_elm_lang$core$Date$toTime(date),
				_elm_lang$core$Date$toTime(start)) < 0) {
				return result;
			} else {
				var _v4 = {ctor: '::', _0: date, _1: result},
					_v5 = interval,
					_v6 = step,
					_v7 = start,
					_v8 = A3(_justinmimbs$elm_date_extra$Date_Extra$add, interval, step, date);
				result = _v4;
				interval = _v5;
				step = _v6;
				start = _v7;
				date = _v8;
				continue rangeHelp;
			}
		}
	});
var _justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate = F3(
	function (y, m, d) {
		return _justinmimbs$elm_date_extra$Date_Extra$fromOffsetTime(
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Maybe$Nothing,
				_1: A3(_justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromCalendarDate, y, m, d)
			});
	});
var _justinmimbs$elm_date_extra$Date_Extra$floor = F2(
	function (interval, date) {
		var _p9 = _justinmimbs$elm_date_extra$Date_Extra$toParts(date);
		var y = _p9._0;
		var m = _p9._1;
		var d = _p9._2;
		var hh = _p9._3;
		var mm = _p9._4;
		var ss = _p9._5;
		var _p10 = interval;
		switch (_p10.ctor) {
			case 'Millisecond':
				return date;
			case 'Second':
				return A7(_justinmimbs$elm_date_extra$Date_Extra$fromParts, y, m, d, hh, mm, ss, 0);
			case 'Minute':
				return A7(_justinmimbs$elm_date_extra$Date_Extra$fromParts, y, m, d, hh, mm, 0, 0);
			case 'Hour':
				return A7(_justinmimbs$elm_date_extra$Date_Extra$fromParts, y, m, d, hh, 0, 0, 0);
			case 'Day':
				return A3(_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate, y, m, d);
			case 'Month':
				return A3(_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate, y, m, 1);
			case 'Year':
				return A3(_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate, y, _elm_lang$core$Date$Jan, 1);
			case 'Quarter':
				return A3(
					_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate,
					y,
					_justinmimbs$elm_date_extra$Date_Extra$monthFromQuarter(
						_justinmimbs$elm_date_extra$Date_Extra$quarter(date)),
					1);
			case 'Week':
				return A3(
					_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate,
					y,
					m,
					d + A2(_justinmimbs$elm_date_extra$Date_Extra$daysToPreviousDayOfWeek, _elm_lang$core$Date$Mon, date));
			case 'Monday':
				return A3(
					_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate,
					y,
					m,
					d + A2(_justinmimbs$elm_date_extra$Date_Extra$daysToPreviousDayOfWeek, _elm_lang$core$Date$Mon, date));
			case 'Tuesday':
				return A3(
					_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate,
					y,
					m,
					d + A2(_justinmimbs$elm_date_extra$Date_Extra$daysToPreviousDayOfWeek, _elm_lang$core$Date$Tue, date));
			case 'Wednesday':
				return A3(
					_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate,
					y,
					m,
					d + A2(_justinmimbs$elm_date_extra$Date_Extra$daysToPreviousDayOfWeek, _elm_lang$core$Date$Wed, date));
			case 'Thursday':
				return A3(
					_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate,
					y,
					m,
					d + A2(_justinmimbs$elm_date_extra$Date_Extra$daysToPreviousDayOfWeek, _elm_lang$core$Date$Thu, date));
			case 'Friday':
				return A3(
					_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate,
					y,
					m,
					d + A2(_justinmimbs$elm_date_extra$Date_Extra$daysToPreviousDayOfWeek, _elm_lang$core$Date$Fri, date));
			case 'Saturday':
				return A3(
					_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate,
					y,
					m,
					d + A2(_justinmimbs$elm_date_extra$Date_Extra$daysToPreviousDayOfWeek, _elm_lang$core$Date$Sat, date));
			default:
				return A3(
					_justinmimbs$elm_date_extra$Date_Extra$fromCalendarDate,
					y,
					m,
					d + A2(_justinmimbs$elm_date_extra$Date_Extra$daysToPreviousDayOfWeek, _elm_lang$core$Date$Sun, date));
		}
	});
var _justinmimbs$elm_date_extra$Date_Extra$ceiling = F2(
	function (interval, date) {
		var floored = A2(_justinmimbs$elm_date_extra$Date_Extra$floor, interval, date);
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$Date$toTime(date),
			_elm_lang$core$Date$toTime(floored)) ? date : A3(_justinmimbs$elm_date_extra$Date_Extra$add, interval, 1, floored);
	});
var _justinmimbs$elm_date_extra$Date_Extra$range = F4(
	function (interval, step, start, end) {
		var stepBack = _elm_lang$core$Basics$negate(
			A2(_elm_lang$core$Basics$max, 1, step));
		return A5(
			_justinmimbs$elm_date_extra$Date_Extra$rangeHelp,
			{ctor: '[]'},
			interval,
			stepBack,
			start,
			A2(
				_justinmimbs$elm_date_extra$Date_Extra$ceiling,
				interval,
				A3(_justinmimbs$elm_date_extra$Date_Extra$add, interval, stepBack, end)));
	});
var _justinmimbs$elm_date_extra$Date_Extra$fromIsoString = function (_p11) {
	return A2(
		_elm_lang$core$Maybe$map,
		_justinmimbs$elm_date_extra$Date_Extra$fromOffsetTime,
		_justinmimbs$elm_date_extra$Date_Internal_Parse$offsetTimeFromIsoString(_p11));
};
var _justinmimbs$elm_date_extra$Date_Extra$fromSpec = F3(
	function (_p14, _p13, _p12) {
		var _p15 = _p14;
		var _p16 = _p13;
		var _p17 = _p12;
		return _justinmimbs$elm_date_extra$Date_Extra$fromOffsetTime(
			{ctor: '_Tuple2', _0: _p15._0, _1: _p17._0 + _p16._0});
	});
var _justinmimbs$elm_date_extra$Date_Extra$Offset = function (a) {
	return {ctor: 'Offset', _0: a};
};
var _justinmimbs$elm_date_extra$Date_Extra$utc = _justinmimbs$elm_date_extra$Date_Extra$Offset(
	_elm_lang$core$Maybe$Just(0));
var _justinmimbs$elm_date_extra$Date_Extra$offset = function (minutes) {
	return _justinmimbs$elm_date_extra$Date_Extra$Offset(
		_elm_lang$core$Maybe$Just(minutes));
};
var _justinmimbs$elm_date_extra$Date_Extra$local = _justinmimbs$elm_date_extra$Date_Extra$Offset(_elm_lang$core$Maybe$Nothing);
var _justinmimbs$elm_date_extra$Date_Extra$TimeMS = function (a) {
	return {ctor: 'TimeMS', _0: a};
};
var _justinmimbs$elm_date_extra$Date_Extra$noTime = _justinmimbs$elm_date_extra$Date_Extra$TimeMS(0);
var _justinmimbs$elm_date_extra$Date_Extra$atTime = F4(
	function (hh, mm, ss, ms) {
		return _justinmimbs$elm_date_extra$Date_Extra$TimeMS(
			A4(_justinmimbs$elm_date_extra$Date_Internal_Core$msFromTimeParts, hh, mm, ss, ms));
	});
var _justinmimbs$elm_date_extra$Date_Extra$DateMS = function (a) {
	return {ctor: 'DateMS', _0: a};
};
var _justinmimbs$elm_date_extra$Date_Extra$calendarDate = F3(
	function (y, m, d) {
		return _justinmimbs$elm_date_extra$Date_Extra$DateMS(
			A3(_justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromCalendarDate, y, m, d));
	});
var _justinmimbs$elm_date_extra$Date_Extra$ordinalDate = F2(
	function (y, d) {
		return _justinmimbs$elm_date_extra$Date_Extra$DateMS(
			A2(_justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromOrdinalDate, y, d));
	});
var _justinmimbs$elm_date_extra$Date_Extra$weekDate = F3(
	function (y, w, d) {
		return _justinmimbs$elm_date_extra$Date_Extra$DateMS(
			A3(_justinmimbs$elm_date_extra$Date_Internal_Core$unixTimeFromWeekDate, y, w, d));
	});
var _justinmimbs$elm_date_extra$Date_Extra$Sunday = {ctor: 'Sunday'};
var _justinmimbs$elm_date_extra$Date_Extra$Saturday = {ctor: 'Saturday'};
var _justinmimbs$elm_date_extra$Date_Extra$Friday = {ctor: 'Friday'};
var _justinmimbs$elm_date_extra$Date_Extra$Thursday = {ctor: 'Thursday'};
var _justinmimbs$elm_date_extra$Date_Extra$Wednesday = {ctor: 'Wednesday'};
var _justinmimbs$elm_date_extra$Date_Extra$Tuesday = {ctor: 'Tuesday'};
var _justinmimbs$elm_date_extra$Date_Extra$Monday = {ctor: 'Monday'};
var _justinmimbs$elm_date_extra$Date_Extra$Week = {ctor: 'Week'};
var _justinmimbs$elm_date_extra$Date_Extra$Quarter = {ctor: 'Quarter'};
var _justinmimbs$elm_date_extra$Date_Extra$Year = {ctor: 'Year'};
var _justinmimbs$elm_date_extra$Date_Extra$Month = {ctor: 'Month'};
var _justinmimbs$elm_date_extra$Date_Extra$Day = {ctor: 'Day'};
var _justinmimbs$elm_date_extra$Date_Extra$diff = F3(
	function (interval, date1, date2) {
		var diffMS = _elm_lang$core$Basics$floor(
			_elm_lang$core$Date$toTime(date2) - _elm_lang$core$Date$toTime(date1));
		var _p18 = interval;
		switch (_p18.ctor) {
			case 'Millisecond':
				return diffMS;
			case 'Second':
				return (diffMS / _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerSecond) | 0;
			case 'Minute':
				return (diffMS / _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerMinute) | 0;
			case 'Hour':
				return (diffMS / _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerHour) | 0;
			case 'Day':
				return (diffMS / _justinmimbs$elm_date_extra$Date_Extra_Facts$msPerDay) | 0;
			case 'Month':
				return A2(_justinmimbs$elm_date_extra$Date_Extra$diffMonth, date1, date2);
			case 'Year':
				return (A2(_justinmimbs$elm_date_extra$Date_Extra$diffMonth, date1, date2) / 12) | 0;
			case 'Quarter':
				return (A2(_justinmimbs$elm_date_extra$Date_Extra$diffMonth, date1, date2) / 3) | 0;
			case 'Week':
				return (A3(_justinmimbs$elm_date_extra$Date_Extra$diff, _justinmimbs$elm_date_extra$Date_Extra$Day, date1, date2) / 7) | 0;
			default:
				var _p19 = _p18;
				return (A3(
					_justinmimbs$elm_date_extra$Date_Extra$diff,
					_justinmimbs$elm_date_extra$Date_Extra$Day,
					A2(_justinmimbs$elm_date_extra$Date_Extra$floor, _p19, date1),
					A2(_justinmimbs$elm_date_extra$Date_Extra$floor, _p19, date2)) / 7) | 0;
		}
	});
var _justinmimbs$elm_date_extra$Date_Extra$Hour = {ctor: 'Hour'};
var _justinmimbs$elm_date_extra$Date_Extra$Minute = {ctor: 'Minute'};
var _justinmimbs$elm_date_extra$Date_Extra$equalBy = F3(
	function (interval, date1, date2) {
		equalBy:
		while (true) {
			var _p20 = interval;
			switch (_p20.ctor) {
				case 'Millisecond':
					return _elm_lang$core$Native_Utils.eq(
						_elm_lang$core$Date$toTime(date1),
						_elm_lang$core$Date$toTime(date2));
				case 'Second':
					return _elm_lang$core$Native_Utils.eq(
						_elm_lang$core$Date$second(date1),
						_elm_lang$core$Date$second(date2)) && A3(_justinmimbs$elm_date_extra$Date_Extra$equalBy, _justinmimbs$elm_date_extra$Date_Extra$Minute, date1, date2);
				case 'Minute':
					return _elm_lang$core$Native_Utils.eq(
						_elm_lang$core$Date$minute(date1),
						_elm_lang$core$Date$minute(date2)) && A3(_justinmimbs$elm_date_extra$Date_Extra$equalBy, _justinmimbs$elm_date_extra$Date_Extra$Hour, date1, date2);
				case 'Hour':
					return _elm_lang$core$Native_Utils.eq(
						_elm_lang$core$Date$hour(date1),
						_elm_lang$core$Date$hour(date2)) && A3(_justinmimbs$elm_date_extra$Date_Extra$equalBy, _justinmimbs$elm_date_extra$Date_Extra$Day, date1, date2);
				case 'Day':
					return _elm_lang$core$Native_Utils.eq(
						_elm_lang$core$Date$day(date1),
						_elm_lang$core$Date$day(date2)) && A3(_justinmimbs$elm_date_extra$Date_Extra$equalBy, _justinmimbs$elm_date_extra$Date_Extra$Month, date1, date2);
				case 'Month':
					return _elm_lang$core$Native_Utils.eq(
						_elm_lang$core$Date$month(date1),
						_elm_lang$core$Date$month(date2)) && A3(_justinmimbs$elm_date_extra$Date_Extra$equalBy, _justinmimbs$elm_date_extra$Date_Extra$Year, date1, date2);
				case 'Year':
					return _elm_lang$core$Native_Utils.eq(
						_elm_lang$core$Date$year(date1),
						_elm_lang$core$Date$year(date2));
				case 'Quarter':
					return _elm_lang$core$Native_Utils.eq(
						_justinmimbs$elm_date_extra$Date_Extra$quarter(date1),
						_justinmimbs$elm_date_extra$Date_Extra$quarter(date2)) && A3(_justinmimbs$elm_date_extra$Date_Extra$equalBy, _justinmimbs$elm_date_extra$Date_Extra$Year, date1, date2);
				case 'Week':
					return _elm_lang$core$Native_Utils.eq(
						_justinmimbs$elm_date_extra$Date_Extra$weekNumber(date1),
						_justinmimbs$elm_date_extra$Date_Extra$weekNumber(date2)) && _elm_lang$core$Native_Utils.eq(
						_justinmimbs$elm_date_extra$Date_Extra$weekYear(date1),
						_justinmimbs$elm_date_extra$Date_Extra$weekYear(date2));
				default:
					var _p21 = _p20;
					var _v15 = _justinmimbs$elm_date_extra$Date_Extra$Day,
						_v16 = A2(_justinmimbs$elm_date_extra$Date_Extra$floor, _p21, date1),
						_v17 = A2(_justinmimbs$elm_date_extra$Date_Extra$floor, _p21, date2);
					interval = _v15;
					date1 = _v16;
					date2 = _v17;
					continue equalBy;
			}
		}
	});
var _justinmimbs$elm_date_extra$Date_Extra$Second = {ctor: 'Second'};
var _justinmimbs$elm_date_extra$Date_Extra$Millisecond = {ctor: 'Millisecond'};

var _ohanhi$keyboard_extra$Keyboard_Arrows$boolToInt = function (bool) {
	return bool ? 1 : 0;
};
var _ohanhi$keyboard_extra$Keyboard_Arrows$determineArrows = function (keys) {
	var toInt = function (key) {
		return _ohanhi$keyboard_extra$Keyboard_Arrows$boolToInt(
			A2(_elm_lang$core$Set$member, key, keys));
	};
	var x = toInt(39) - toInt(37);
	var y = toInt(38) - toInt(40);
	return {x: x, y: y};
};
var _ohanhi$keyboard_extra$Keyboard_Arrows$determineWasd = function (keys) {
	var toInt = function (key) {
		return _ohanhi$keyboard_extra$Keyboard_Arrows$boolToInt(
			A2(_elm_lang$core$Set$member, key, keys));
	};
	var x = toInt(68) - toInt(65);
	var y = toInt(87) - toInt(83);
	return {x: x, y: y};
};
var _ohanhi$keyboard_extra$Keyboard_Arrows$init = {x: 0, y: 0};
var _ohanhi$keyboard_extra$Keyboard_Arrows$Arrows = F2(
	function (a, b) {
		return {x: a, y: b};
	});

var _ohanhi$keyboard_extra$Keyboard_Extra$wasd = function (model) {
	return _ohanhi$keyboard_extra$Keyboard_Arrows$determineWasd(model.keysDown);
};
var _ohanhi$keyboard_extra$Keyboard_Extra$arrows = function (model) {
	return _ohanhi$keyboard_extra$Keyboard_Arrows$determineArrows(model.keysDown);
};
var _ohanhi$keyboard_extra$Keyboard_Extra$update = F2(
	function (msg, model) {
		var _p0 = msg;
		if (_p0.ctor === 'Down') {
			var keysDown = A2(_elm_lang$core$Set$insert, _p0._0, model.keysDown);
			return A2(
				_elm_lang$core$Platform_Cmd_ops['!'],
				_elm_lang$core$Native_Utils.update(
					model,
					{keysDown: keysDown}),
				{ctor: '[]'});
		} else {
			var keysDown = A2(_elm_lang$core$Set$remove, _p0._0, model.keysDown);
			return A2(
				_elm_lang$core$Platform_Cmd_ops['!'],
				_elm_lang$core$Native_Utils.update(
					model,
					{keysDown: keysDown}),
				{ctor: '[]'});
		}
	});
var _ohanhi$keyboard_extra$Keyboard_Extra$Model = function (a) {
	return {keysDown: a};
};
var _ohanhi$keyboard_extra$Keyboard_Extra$init = {
	ctor: '_Tuple2',
	_0: _ohanhi$keyboard_extra$Keyboard_Extra$Model(_elm_lang$core$Set$empty),
	_1: _elm_lang$core$Platform_Cmd$none
};
var _ohanhi$keyboard_extra$Keyboard_Extra$Up = function (a) {
	return {ctor: 'Up', _0: a};
};
var _ohanhi$keyboard_extra$Keyboard_Extra$Down = function (a) {
	return {ctor: 'Down', _0: a};
};
var _ohanhi$keyboard_extra$Keyboard_Extra$subscriptions = _elm_lang$core$Platform_Sub$batch(
	{
		ctor: '::',
		_0: _elm_lang$keyboard$Keyboard$downs(_ohanhi$keyboard_extra$Keyboard_Extra$Down),
		_1: {
			ctor: '::',
			_0: _elm_lang$keyboard$Keyboard$ups(_ohanhi$keyboard_extra$Keyboard_Extra$Up),
			_1: {ctor: '[]'}
		}
	});
var _ohanhi$keyboard_extra$Keyboard_Extra$NoDirection = {ctor: 'NoDirection'};
var _ohanhi$keyboard_extra$Keyboard_Extra$NorthWest = {ctor: 'NorthWest'};
var _ohanhi$keyboard_extra$Keyboard_Extra$West = {ctor: 'West'};
var _ohanhi$keyboard_extra$Keyboard_Extra$SouthWest = {ctor: 'SouthWest'};
var _ohanhi$keyboard_extra$Keyboard_Extra$South = {ctor: 'South'};
var _ohanhi$keyboard_extra$Keyboard_Extra$SouthEast = {ctor: 'SouthEast'};
var _ohanhi$keyboard_extra$Keyboard_Extra$East = {ctor: 'East'};
var _ohanhi$keyboard_extra$Keyboard_Extra$NorthEast = {ctor: 'NorthEast'};
var _ohanhi$keyboard_extra$Keyboard_Extra$North = {ctor: 'North'};
var _ohanhi$keyboard_extra$Keyboard_Extra$arrowsToDir = function (_p1) {
	var _p2 = _p1;
	var _p3 = {ctor: '_Tuple2', _0: _p2.x, _1: _p2.y};
	_v2_8:
	do {
		if (_p3.ctor === '_Tuple2') {
			switch (_p3._0) {
				case 1:
					switch (_p3._1) {
						case 1:
							return _ohanhi$keyboard_extra$Keyboard_Extra$NorthEast;
						case 0:
							return _ohanhi$keyboard_extra$Keyboard_Extra$East;
						case -1:
							return _ohanhi$keyboard_extra$Keyboard_Extra$SouthEast;
						default:
							break _v2_8;
					}
				case 0:
					switch (_p3._1) {
						case 1:
							return _ohanhi$keyboard_extra$Keyboard_Extra$North;
						case -1:
							return _ohanhi$keyboard_extra$Keyboard_Extra$South;
						default:
							break _v2_8;
					}
				case -1:
					switch (_p3._1) {
						case -1:
							return _ohanhi$keyboard_extra$Keyboard_Extra$SouthWest;
						case 0:
							return _ohanhi$keyboard_extra$Keyboard_Extra$West;
						case 1:
							return _ohanhi$keyboard_extra$Keyboard_Extra$NorthWest;
						default:
							break _v2_8;
					}
				default:
					break _v2_8;
			}
		} else {
			break _v2_8;
		}
	} while(false);
	return _ohanhi$keyboard_extra$Keyboard_Extra$NoDirection;
};
var _ohanhi$keyboard_extra$Keyboard_Extra$arrowsDirection = function (_p4) {
	return _ohanhi$keyboard_extra$Keyboard_Extra$arrowsToDir(
		_ohanhi$keyboard_extra$Keyboard_Extra$arrows(_p4));
};
var _ohanhi$keyboard_extra$Keyboard_Extra$wasdDirection = function (_p5) {
	return _ohanhi$keyboard_extra$Keyboard_Extra$arrowsToDir(
		_ohanhi$keyboard_extra$Keyboard_Extra$wasd(_p5));
};
var _ohanhi$keyboard_extra$Keyboard_Extra$Other = {ctor: 'Other'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Altgr = {ctor: 'Altgr'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Meta = {ctor: 'Meta'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Quote = {ctor: 'Quote'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CloseBracket = {ctor: 'CloseBracket'};
var _ohanhi$keyboard_extra$Keyboard_Extra$BackSlash = {ctor: 'BackSlash'};
var _ohanhi$keyboard_extra$Keyboard_Extra$OpenBracket = {ctor: 'OpenBracket'};
var _ohanhi$keyboard_extra$Keyboard_Extra$BackQuote = {ctor: 'BackQuote'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Slash = {ctor: 'Slash'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Period = {ctor: 'Period'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Minus = {ctor: 'Minus'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Comma = {ctor: 'Comma'};
var _ohanhi$keyboard_extra$Keyboard_Extra$VolumeUp = {ctor: 'VolumeUp'};
var _ohanhi$keyboard_extra$Keyboard_Extra$VolumeDown = {ctor: 'VolumeDown'};
var _ohanhi$keyboard_extra$Keyboard_Extra$VolumeMute = {ctor: 'VolumeMute'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Tilde = {ctor: 'Tilde'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CloseCurlyBracket = {ctor: 'CloseCurlyBracket'};
var _ohanhi$keyboard_extra$Keyboard_Extra$OpenCurlyBracket = {ctor: 'OpenCurlyBracket'};
var _ohanhi$keyboard_extra$Keyboard_Extra$HyphenMinus = {ctor: 'HyphenMinus'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Pipe = {ctor: 'Pipe'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Plus = {ctor: 'Plus'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Asterisk = {ctor: 'Asterisk'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CloseParen = {ctor: 'CloseParen'};
var _ohanhi$keyboard_extra$Keyboard_Extra$OpenParen = {ctor: 'OpenParen'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Underscore = {ctor: 'Underscore'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Ampersand = {ctor: 'Ampersand'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Percent = {ctor: 'Percent'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Dollar = {ctor: 'Dollar'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Hash = {ctor: 'Hash'};
var _ohanhi$keyboard_extra$Keyboard_Extra$DoubleQuote = {ctor: 'DoubleQuote'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Exclamation = {ctor: 'Exclamation'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Circumflex = {ctor: 'Circumflex'};
var _ohanhi$keyboard_extra$Keyboard_Extra$ScrollLock = {ctor: 'ScrollLock'};
var _ohanhi$keyboard_extra$Keyboard_Extra$NumLock = {ctor: 'NumLock'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F24 = {ctor: 'F24'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F23 = {ctor: 'F23'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F22 = {ctor: 'F22'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F21 = {ctor: 'F21'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F20 = {ctor: 'F20'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F19 = {ctor: 'F19'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F18 = {ctor: 'F18'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F17 = {ctor: 'F17'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F16 = {ctor: 'F16'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F15 = {ctor: 'F15'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F14 = {ctor: 'F14'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F13 = {ctor: 'F13'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F12 = {ctor: 'F12'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F11 = {ctor: 'F11'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F10 = {ctor: 'F10'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F9 = {ctor: 'F9'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F8 = {ctor: 'F8'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F7 = {ctor: 'F7'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F6 = {ctor: 'F6'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F5 = {ctor: 'F5'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F4 = {ctor: 'F4'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F3 = {ctor: 'F3'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F2 = {ctor: 'F2'};
var _ohanhi$keyboard_extra$Keyboard_Extra$F1 = {ctor: 'F1'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Divide = {ctor: 'Divide'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Decimal = {ctor: 'Decimal'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Subtract = {ctor: 'Subtract'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Separator = {ctor: 'Separator'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Add = {ctor: 'Add'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Multiply = {ctor: 'Multiply'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad9 = {ctor: 'Numpad9'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad8 = {ctor: 'Numpad8'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad7 = {ctor: 'Numpad7'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad6 = {ctor: 'Numpad6'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad5 = {ctor: 'Numpad5'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad4 = {ctor: 'Numpad4'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad3 = {ctor: 'Numpad3'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad2 = {ctor: 'Numpad2'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad1 = {ctor: 'Numpad1'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Numpad0 = {ctor: 'Numpad0'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Sleep = {ctor: 'Sleep'};
var _ohanhi$keyboard_extra$Keyboard_Extra$ContextMenu = {ctor: 'ContextMenu'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Super = {ctor: 'Super'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharZ = {ctor: 'CharZ'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharY = {ctor: 'CharY'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharX = {ctor: 'CharX'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharW = {ctor: 'CharW'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharV = {ctor: 'CharV'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharU = {ctor: 'CharU'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharT = {ctor: 'CharT'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharS = {ctor: 'CharS'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharR = {ctor: 'CharR'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharQ = {ctor: 'CharQ'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharP = {ctor: 'CharP'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharO = {ctor: 'CharO'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharN = {ctor: 'CharN'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharM = {ctor: 'CharM'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharL = {ctor: 'CharL'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharK = {ctor: 'CharK'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharJ = {ctor: 'CharJ'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharI = {ctor: 'CharI'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharH = {ctor: 'CharH'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharG = {ctor: 'CharG'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharF = {ctor: 'CharF'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharE = {ctor: 'CharE'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharD = {ctor: 'CharD'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharC = {ctor: 'CharC'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharB = {ctor: 'CharB'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CharA = {ctor: 'CharA'};
var _ohanhi$keyboard_extra$Keyboard_Extra$At = {ctor: 'At'};
var _ohanhi$keyboard_extra$Keyboard_Extra$QuestionMark = {ctor: 'QuestionMark'};
var _ohanhi$keyboard_extra$Keyboard_Extra$GreaterThan = {ctor: 'GreaterThan'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Equals = {ctor: 'Equals'};
var _ohanhi$keyboard_extra$Keyboard_Extra$LessThan = {ctor: 'LessThan'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Semicolon = {ctor: 'Semicolon'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Colon = {ctor: 'Colon'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number9 = {ctor: 'Number9'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number8 = {ctor: 'Number8'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number7 = {ctor: 'Number7'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number6 = {ctor: 'Number6'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number5 = {ctor: 'Number5'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number4 = {ctor: 'Number4'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number3 = {ctor: 'Number3'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number2 = {ctor: 'Number2'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number1 = {ctor: 'Number1'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Number0 = {ctor: 'Number0'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Delete = {ctor: 'Delete'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Insert = {ctor: 'Insert'};
var _ohanhi$keyboard_extra$Keyboard_Extra$PrintScreen = {ctor: 'PrintScreen'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Execute = {ctor: 'Execute'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Print = {ctor: 'Print'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Select = {ctor: 'Select'};
var _ohanhi$keyboard_extra$Keyboard_Extra$ArrowDown = {ctor: 'ArrowDown'};
var _ohanhi$keyboard_extra$Keyboard_Extra$ArrowRight = {ctor: 'ArrowRight'};
var _ohanhi$keyboard_extra$Keyboard_Extra$ArrowUp = {ctor: 'ArrowUp'};
var _ohanhi$keyboard_extra$Keyboard_Extra$ArrowLeft = {ctor: 'ArrowLeft'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Home = {ctor: 'Home'};
var _ohanhi$keyboard_extra$Keyboard_Extra$End = {ctor: 'End'};
var _ohanhi$keyboard_extra$Keyboard_Extra$PageDown = {ctor: 'PageDown'};
var _ohanhi$keyboard_extra$Keyboard_Extra$PageUp = {ctor: 'PageUp'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Space = {ctor: 'Space'};
var _ohanhi$keyboard_extra$Keyboard_Extra$ModeChange = {ctor: 'ModeChange'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Accept = {ctor: 'Accept'};
var _ohanhi$keyboard_extra$Keyboard_Extra$NonConvert = {ctor: 'NonConvert'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Convert = {ctor: 'Convert'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Escape = {ctor: 'Escape'};
var _ohanhi$keyboard_extra$Keyboard_Extra$CapsLock = {ctor: 'CapsLock'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Pause = {ctor: 'Pause'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Alt = {ctor: 'Alt'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Control = {ctor: 'Control'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Shift = {ctor: 'Shift'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Enter = {ctor: 'Enter'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Clear = {ctor: 'Clear'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Tab = {ctor: 'Tab'};
var _ohanhi$keyboard_extra$Keyboard_Extra$BackSpace = {ctor: 'BackSpace'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Help = {ctor: 'Help'};
var _ohanhi$keyboard_extra$Keyboard_Extra$Cancel = {ctor: 'Cancel'};
var _ohanhi$keyboard_extra$Keyboard_Extra$codeBook = {
	ctor: '::',
	_0: {ctor: '_Tuple2', _0: 3, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Cancel},
	_1: {
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 6, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Help},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 8, _1: _ohanhi$keyboard_extra$Keyboard_Extra$BackSpace},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 9, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Tab},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 12, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Clear},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 13, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Enter},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 16, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Shift},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 17, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Control},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 18, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Alt},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 19, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Pause},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 20, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CapsLock},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 27, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Escape},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 28, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Convert},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 29, _1: _ohanhi$keyboard_extra$Keyboard_Extra$NonConvert},
														_1: {
															ctor: '::',
															_0: {ctor: '_Tuple2', _0: 30, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Accept},
															_1: {
																ctor: '::',
																_0: {ctor: '_Tuple2', _0: 31, _1: _ohanhi$keyboard_extra$Keyboard_Extra$ModeChange},
																_1: {
																	ctor: '::',
																	_0: {ctor: '_Tuple2', _0: 32, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Space},
																	_1: {
																		ctor: '::',
																		_0: {ctor: '_Tuple2', _0: 33, _1: _ohanhi$keyboard_extra$Keyboard_Extra$PageUp},
																		_1: {
																			ctor: '::',
																			_0: {ctor: '_Tuple2', _0: 34, _1: _ohanhi$keyboard_extra$Keyboard_Extra$PageDown},
																			_1: {
																				ctor: '::',
																				_0: {ctor: '_Tuple2', _0: 35, _1: _ohanhi$keyboard_extra$Keyboard_Extra$End},
																				_1: {
																					ctor: '::',
																					_0: {ctor: '_Tuple2', _0: 36, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Home},
																					_1: {
																						ctor: '::',
																						_0: {ctor: '_Tuple2', _0: 37, _1: _ohanhi$keyboard_extra$Keyboard_Extra$ArrowLeft},
																						_1: {
																							ctor: '::',
																							_0: {ctor: '_Tuple2', _0: 38, _1: _ohanhi$keyboard_extra$Keyboard_Extra$ArrowUp},
																							_1: {
																								ctor: '::',
																								_0: {ctor: '_Tuple2', _0: 39, _1: _ohanhi$keyboard_extra$Keyboard_Extra$ArrowRight},
																								_1: {
																									ctor: '::',
																									_0: {ctor: '_Tuple2', _0: 40, _1: _ohanhi$keyboard_extra$Keyboard_Extra$ArrowDown},
																									_1: {
																										ctor: '::',
																										_0: {ctor: '_Tuple2', _0: 41, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Select},
																										_1: {
																											ctor: '::',
																											_0: {ctor: '_Tuple2', _0: 42, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Print},
																											_1: {
																												ctor: '::',
																												_0: {ctor: '_Tuple2', _0: 43, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Execute},
																												_1: {
																													ctor: '::',
																													_0: {ctor: '_Tuple2', _0: 44, _1: _ohanhi$keyboard_extra$Keyboard_Extra$PrintScreen},
																													_1: {
																														ctor: '::',
																														_0: {ctor: '_Tuple2', _0: 45, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Insert},
																														_1: {
																															ctor: '::',
																															_0: {ctor: '_Tuple2', _0: 46, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Delete},
																															_1: {
																																ctor: '::',
																																_0: {ctor: '_Tuple2', _0: 48, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number0},
																																_1: {
																																	ctor: '::',
																																	_0: {ctor: '_Tuple2', _0: 49, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number1},
																																	_1: {
																																		ctor: '::',
																																		_0: {ctor: '_Tuple2', _0: 50, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number2},
																																		_1: {
																																			ctor: '::',
																																			_0: {ctor: '_Tuple2', _0: 51, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number3},
																																			_1: {
																																				ctor: '::',
																																				_0: {ctor: '_Tuple2', _0: 52, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number4},
																																				_1: {
																																					ctor: '::',
																																					_0: {ctor: '_Tuple2', _0: 53, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number5},
																																					_1: {
																																						ctor: '::',
																																						_0: {ctor: '_Tuple2', _0: 54, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number6},
																																						_1: {
																																							ctor: '::',
																																							_0: {ctor: '_Tuple2', _0: 55, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number7},
																																							_1: {
																																								ctor: '::',
																																								_0: {ctor: '_Tuple2', _0: 56, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number8},
																																								_1: {
																																									ctor: '::',
																																									_0: {ctor: '_Tuple2', _0: 57, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Number9},
																																									_1: {
																																										ctor: '::',
																																										_0: {ctor: '_Tuple2', _0: 58, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Colon},
																																										_1: {
																																											ctor: '::',
																																											_0: {ctor: '_Tuple2', _0: 59, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Semicolon},
																																											_1: {
																																												ctor: '::',
																																												_0: {ctor: '_Tuple2', _0: 60, _1: _ohanhi$keyboard_extra$Keyboard_Extra$LessThan},
																																												_1: {
																																													ctor: '::',
																																													_0: {ctor: '_Tuple2', _0: 61, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Equals},
																																													_1: {
																																														ctor: '::',
																																														_0: {ctor: '_Tuple2', _0: 62, _1: _ohanhi$keyboard_extra$Keyboard_Extra$GreaterThan},
																																														_1: {
																																															ctor: '::',
																																															_0: {ctor: '_Tuple2', _0: 63, _1: _ohanhi$keyboard_extra$Keyboard_Extra$QuestionMark},
																																															_1: {
																																																ctor: '::',
																																																_0: {ctor: '_Tuple2', _0: 64, _1: _ohanhi$keyboard_extra$Keyboard_Extra$At},
																																																_1: {
																																																	ctor: '::',
																																																	_0: {ctor: '_Tuple2', _0: 65, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharA},
																																																	_1: {
																																																		ctor: '::',
																																																		_0: {ctor: '_Tuple2', _0: 66, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharB},
																																																		_1: {
																																																			ctor: '::',
																																																			_0: {ctor: '_Tuple2', _0: 67, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharC},
																																																			_1: {
																																																				ctor: '::',
																																																				_0: {ctor: '_Tuple2', _0: 68, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharD},
																																																				_1: {
																																																					ctor: '::',
																																																					_0: {ctor: '_Tuple2', _0: 69, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharE},
																																																					_1: {
																																																						ctor: '::',
																																																						_0: {ctor: '_Tuple2', _0: 70, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharF},
																																																						_1: {
																																																							ctor: '::',
																																																							_0: {ctor: '_Tuple2', _0: 71, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharG},
																																																							_1: {
																																																								ctor: '::',
																																																								_0: {ctor: '_Tuple2', _0: 72, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharH},
																																																								_1: {
																																																									ctor: '::',
																																																									_0: {ctor: '_Tuple2', _0: 73, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharI},
																																																									_1: {
																																																										ctor: '::',
																																																										_0: {ctor: '_Tuple2', _0: 74, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharJ},
																																																										_1: {
																																																											ctor: '::',
																																																											_0: {ctor: '_Tuple2', _0: 75, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharK},
																																																											_1: {
																																																												ctor: '::',
																																																												_0: {ctor: '_Tuple2', _0: 76, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharL},
																																																												_1: {
																																																													ctor: '::',
																																																													_0: {ctor: '_Tuple2', _0: 77, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharM},
																																																													_1: {
																																																														ctor: '::',
																																																														_0: {ctor: '_Tuple2', _0: 78, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharN},
																																																														_1: {
																																																															ctor: '::',
																																																															_0: {ctor: '_Tuple2', _0: 79, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharO},
																																																															_1: {
																																																																ctor: '::',
																																																																_0: {ctor: '_Tuple2', _0: 80, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharP},
																																																																_1: {
																																																																	ctor: '::',
																																																																	_0: {ctor: '_Tuple2', _0: 81, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharQ},
																																																																	_1: {
																																																																		ctor: '::',
																																																																		_0: {ctor: '_Tuple2', _0: 82, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharR},
																																																																		_1: {
																																																																			ctor: '::',
																																																																			_0: {ctor: '_Tuple2', _0: 83, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharS},
																																																																			_1: {
																																																																				ctor: '::',
																																																																				_0: {ctor: '_Tuple2', _0: 84, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharT},
																																																																				_1: {
																																																																					ctor: '::',
																																																																					_0: {ctor: '_Tuple2', _0: 85, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharU},
																																																																					_1: {
																																																																						ctor: '::',
																																																																						_0: {ctor: '_Tuple2', _0: 86, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharV},
																																																																						_1: {
																																																																							ctor: '::',
																																																																							_0: {ctor: '_Tuple2', _0: 87, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharW},
																																																																							_1: {
																																																																								ctor: '::',
																																																																								_0: {ctor: '_Tuple2', _0: 88, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharX},
																																																																								_1: {
																																																																									ctor: '::',
																																																																									_0: {ctor: '_Tuple2', _0: 89, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharY},
																																																																									_1: {
																																																																										ctor: '::',
																																																																										_0: {ctor: '_Tuple2', _0: 90, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CharZ},
																																																																										_1: {
																																																																											ctor: '::',
																																																																											_0: {ctor: '_Tuple2', _0: 91, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Super},
																																																																											_1: {
																																																																												ctor: '::',
																																																																												_0: {ctor: '_Tuple2', _0: 93, _1: _ohanhi$keyboard_extra$Keyboard_Extra$ContextMenu},
																																																																												_1: {
																																																																													ctor: '::',
																																																																													_0: {ctor: '_Tuple2', _0: 95, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Sleep},
																																																																													_1: {
																																																																														ctor: '::',
																																																																														_0: {ctor: '_Tuple2', _0: 96, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad0},
																																																																														_1: {
																																																																															ctor: '::',
																																																																															_0: {ctor: '_Tuple2', _0: 97, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad1},
																																																																															_1: {
																																																																																ctor: '::',
																																																																																_0: {ctor: '_Tuple2', _0: 98, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad2},
																																																																																_1: {
																																																																																	ctor: '::',
																																																																																	_0: {ctor: '_Tuple2', _0: 99, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad3},
																																																																																	_1: {
																																																																																		ctor: '::',
																																																																																		_0: {ctor: '_Tuple2', _0: 100, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad4},
																																																																																		_1: {
																																																																																			ctor: '::',
																																																																																			_0: {ctor: '_Tuple2', _0: 101, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad5},
																																																																																			_1: {
																																																																																				ctor: '::',
																																																																																				_0: {ctor: '_Tuple2', _0: 102, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad6},
																																																																																				_1: {
																																																																																					ctor: '::',
																																																																																					_0: {ctor: '_Tuple2', _0: 103, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad7},
																																																																																					_1: {
																																																																																						ctor: '::',
																																																																																						_0: {ctor: '_Tuple2', _0: 104, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad8},
																																																																																						_1: {
																																																																																							ctor: '::',
																																																																																							_0: {ctor: '_Tuple2', _0: 105, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Numpad9},
																																																																																							_1: {
																																																																																								ctor: '::',
																																																																																								_0: {ctor: '_Tuple2', _0: 106, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Multiply},
																																																																																								_1: {
																																																																																									ctor: '::',
																																																																																									_0: {ctor: '_Tuple2', _0: 107, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Add},
																																																																																									_1: {
																																																																																										ctor: '::',
																																																																																										_0: {ctor: '_Tuple2', _0: 108, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Separator},
																																																																																										_1: {
																																																																																											ctor: '::',
																																																																																											_0: {ctor: '_Tuple2', _0: 109, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Subtract},
																																																																																											_1: {
																																																																																												ctor: '::',
																																																																																												_0: {ctor: '_Tuple2', _0: 110, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Decimal},
																																																																																												_1: {
																																																																																													ctor: '::',
																																																																																													_0: {ctor: '_Tuple2', _0: 111, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Divide},
																																																																																													_1: {
																																																																																														ctor: '::',
																																																																																														_0: {ctor: '_Tuple2', _0: 112, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F1},
																																																																																														_1: {
																																																																																															ctor: '::',
																																																																																															_0: {ctor: '_Tuple2', _0: 113, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F2},
																																																																																															_1: {
																																																																																																ctor: '::',
																																																																																																_0: {ctor: '_Tuple2', _0: 114, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F3},
																																																																																																_1: {
																																																																																																	ctor: '::',
																																																																																																	_0: {ctor: '_Tuple2', _0: 115, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F4},
																																																																																																	_1: {
																																																																																																		ctor: '::',
																																																																																																		_0: {ctor: '_Tuple2', _0: 116, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F5},
																																																																																																		_1: {
																																																																																																			ctor: '::',
																																																																																																			_0: {ctor: '_Tuple2', _0: 117, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F6},
																																																																																																			_1: {
																																																																																																				ctor: '::',
																																																																																																				_0: {ctor: '_Tuple2', _0: 118, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F7},
																																																																																																				_1: {
																																																																																																					ctor: '::',
																																																																																																					_0: {ctor: '_Tuple2', _0: 119, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F8},
																																																																																																					_1: {
																																																																																																						ctor: '::',
																																																																																																						_0: {ctor: '_Tuple2', _0: 120, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F9},
																																																																																																						_1: {
																																																																																																							ctor: '::',
																																																																																																							_0: {ctor: '_Tuple2', _0: 121, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F10},
																																																																																																							_1: {
																																																																																																								ctor: '::',
																																																																																																								_0: {ctor: '_Tuple2', _0: 122, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F11},
																																																																																																								_1: {
																																																																																																									ctor: '::',
																																																																																																									_0: {ctor: '_Tuple2', _0: 123, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F12},
																																																																																																									_1: {
																																																																																																										ctor: '::',
																																																																																																										_0: {ctor: '_Tuple2', _0: 124, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F13},
																																																																																																										_1: {
																																																																																																											ctor: '::',
																																																																																																											_0: {ctor: '_Tuple2', _0: 125, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F14},
																																																																																																											_1: {
																																																																																																												ctor: '::',
																																																																																																												_0: {ctor: '_Tuple2', _0: 126, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F15},
																																																																																																												_1: {
																																																																																																													ctor: '::',
																																																																																																													_0: {ctor: '_Tuple2', _0: 127, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F16},
																																																																																																													_1: {
																																																																																																														ctor: '::',
																																																																																																														_0: {ctor: '_Tuple2', _0: 128, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F17},
																																																																																																														_1: {
																																																																																																															ctor: '::',
																																																																																																															_0: {ctor: '_Tuple2', _0: 129, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F18},
																																																																																																															_1: {
																																																																																																																ctor: '::',
																																																																																																																_0: {ctor: '_Tuple2', _0: 130, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F19},
																																																																																																																_1: {
																																																																																																																	ctor: '::',
																																																																																																																	_0: {ctor: '_Tuple2', _0: 131, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F20},
																																																																																																																	_1: {
																																																																																																																		ctor: '::',
																																																																																																																		_0: {ctor: '_Tuple2', _0: 132, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F21},
																																																																																																																		_1: {
																																																																																																																			ctor: '::',
																																																																																																																			_0: {ctor: '_Tuple2', _0: 133, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F22},
																																																																																																																			_1: {
																																																																																																																				ctor: '::',
																																																																																																																				_0: {ctor: '_Tuple2', _0: 134, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F23},
																																																																																																																				_1: {
																																																																																																																					ctor: '::',
																																																																																																																					_0: {ctor: '_Tuple2', _0: 135, _1: _ohanhi$keyboard_extra$Keyboard_Extra$F24},
																																																																																																																					_1: {
																																																																																																																						ctor: '::',
																																																																																																																						_0: {ctor: '_Tuple2', _0: 144, _1: _ohanhi$keyboard_extra$Keyboard_Extra$NumLock},
																																																																																																																						_1: {
																																																																																																																							ctor: '::',
																																																																																																																							_0: {ctor: '_Tuple2', _0: 145, _1: _ohanhi$keyboard_extra$Keyboard_Extra$ScrollLock},
																																																																																																																							_1: {
																																																																																																																								ctor: '::',
																																																																																																																								_0: {ctor: '_Tuple2', _0: 160, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Circumflex},
																																																																																																																								_1: {
																																																																																																																									ctor: '::',
																																																																																																																									_0: {ctor: '_Tuple2', _0: 161, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Exclamation},
																																																																																																																									_1: {
																																																																																																																										ctor: '::',
																																																																																																																										_0: {ctor: '_Tuple2', _0: 162, _1: _ohanhi$keyboard_extra$Keyboard_Extra$DoubleQuote},
																																																																																																																										_1: {
																																																																																																																											ctor: '::',
																																																																																																																											_0: {ctor: '_Tuple2', _0: 163, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Hash},
																																																																																																																											_1: {
																																																																																																																												ctor: '::',
																																																																																																																												_0: {ctor: '_Tuple2', _0: 164, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Dollar},
																																																																																																																												_1: {
																																																																																																																													ctor: '::',
																																																																																																																													_0: {ctor: '_Tuple2', _0: 165, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Percent},
																																																																																																																													_1: {
																																																																																																																														ctor: '::',
																																																																																																																														_0: {ctor: '_Tuple2', _0: 166, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Ampersand},
																																																																																																																														_1: {
																																																																																																																															ctor: '::',
																																																																																																																															_0: {ctor: '_Tuple2', _0: 167, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Underscore},
																																																																																																																															_1: {
																																																																																																																																ctor: '::',
																																																																																																																																_0: {ctor: '_Tuple2', _0: 168, _1: _ohanhi$keyboard_extra$Keyboard_Extra$OpenParen},
																																																																																																																																_1: {
																																																																																																																																	ctor: '::',
																																																																																																																																	_0: {ctor: '_Tuple2', _0: 169, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CloseParen},
																																																																																																																																	_1: {
																																																																																																																																		ctor: '::',
																																																																																																																																		_0: {ctor: '_Tuple2', _0: 170, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Asterisk},
																																																																																																																																		_1: {
																																																																																																																																			ctor: '::',
																																																																																																																																			_0: {ctor: '_Tuple2', _0: 171, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Plus},
																																																																																																																																			_1: {
																																																																																																																																				ctor: '::',
																																																																																																																																				_0: {ctor: '_Tuple2', _0: 172, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Pipe},
																																																																																																																																				_1: {
																																																																																																																																					ctor: '::',
																																																																																																																																					_0: {ctor: '_Tuple2', _0: 173, _1: _ohanhi$keyboard_extra$Keyboard_Extra$HyphenMinus},
																																																																																																																																					_1: {
																																																																																																																																						ctor: '::',
																																																																																																																																						_0: {ctor: '_Tuple2', _0: 174, _1: _ohanhi$keyboard_extra$Keyboard_Extra$OpenCurlyBracket},
																																																																																																																																						_1: {
																																																																																																																																							ctor: '::',
																																																																																																																																							_0: {ctor: '_Tuple2', _0: 175, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CloseCurlyBracket},
																																																																																																																																							_1: {
																																																																																																																																								ctor: '::',
																																																																																																																																								_0: {ctor: '_Tuple2', _0: 176, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Tilde},
																																																																																																																																								_1: {
																																																																																																																																									ctor: '::',
																																																																																																																																									_0: {ctor: '_Tuple2', _0: 181, _1: _ohanhi$keyboard_extra$Keyboard_Extra$VolumeMute},
																																																																																																																																									_1: {
																																																																																																																																										ctor: '::',
																																																																																																																																										_0: {ctor: '_Tuple2', _0: 182, _1: _ohanhi$keyboard_extra$Keyboard_Extra$VolumeDown},
																																																																																																																																										_1: {
																																																																																																																																											ctor: '::',
																																																																																																																																											_0: {ctor: '_Tuple2', _0: 183, _1: _ohanhi$keyboard_extra$Keyboard_Extra$VolumeUp},
																																																																																																																																											_1: {
																																																																																																																																												ctor: '::',
																																																																																																																																												_0: {ctor: '_Tuple2', _0: 186, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Semicolon},
																																																																																																																																												_1: {
																																																																																																																																													ctor: '::',
																																																																																																																																													_0: {ctor: '_Tuple2', _0: 187, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Equals},
																																																																																																																																													_1: {
																																																																																																																																														ctor: '::',
																																																																																																																																														_0: {ctor: '_Tuple2', _0: 188, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Comma},
																																																																																																																																														_1: {
																																																																																																																																															ctor: '::',
																																																																																																																																															_0: {ctor: '_Tuple2', _0: 189, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Minus},
																																																																																																																																															_1: {
																																																																																																																																																ctor: '::',
																																																																																																																																																_0: {ctor: '_Tuple2', _0: 190, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Period},
																																																																																																																																																_1: {
																																																																																																																																																	ctor: '::',
																																																																																																																																																	_0: {ctor: '_Tuple2', _0: 191, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Slash},
																																																																																																																																																	_1: {
																																																																																																																																																		ctor: '::',
																																																																																																																																																		_0: {ctor: '_Tuple2', _0: 192, _1: _ohanhi$keyboard_extra$Keyboard_Extra$BackQuote},
																																																																																																																																																		_1: {
																																																																																																																																																			ctor: '::',
																																																																																																																																																			_0: {ctor: '_Tuple2', _0: 219, _1: _ohanhi$keyboard_extra$Keyboard_Extra$OpenBracket},
																																																																																																																																																			_1: {
																																																																																																																																																				ctor: '::',
																																																																																																																																																				_0: {ctor: '_Tuple2', _0: 220, _1: _ohanhi$keyboard_extra$Keyboard_Extra$BackSlash},
																																																																																																																																																				_1: {
																																																																																																																																																					ctor: '::',
																																																																																																																																																					_0: {ctor: '_Tuple2', _0: 221, _1: _ohanhi$keyboard_extra$Keyboard_Extra$CloseBracket},
																																																																																																																																																					_1: {
																																																																																																																																																						ctor: '::',
																																																																																																																																																						_0: {ctor: '_Tuple2', _0: 222, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Quote},
																																																																																																																																																						_1: {
																																																																																																																																																							ctor: '::',
																																																																																																																																																							_0: {ctor: '_Tuple2', _0: 224, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Meta},
																																																																																																																																																							_1: {
																																																																																																																																																								ctor: '::',
																																																																																																																																																								_0: {ctor: '_Tuple2', _0: 225, _1: _ohanhi$keyboard_extra$Keyboard_Extra$Altgr},
																																																																																																																																																								_1: {ctor: '[]'}
																																																																																																																																																							}
																																																																																																																																																						}
																																																																																																																																																					}
																																																																																																																																																				}
																																																																																																																																																			}
																																																																																																																																																		}
																																																																																																																																																	}
																																																																																																																																																}
																																																																																																																																															}
																																																																																																																																														}
																																																																																																																																													}
																																																																																																																																												}
																																																																																																																																											}
																																																																																																																																										}
																																																																																																																																									}
																																																																																																																																								}
																																																																																																																																							}
																																																																																																																																						}
																																																																																																																																					}
																																																																																																																																				}
																																																																																																																																			}
																																																																																																																																		}
																																																																																																																																	}
																																																																																																																																}
																																																																																																																															}
																																																																																																																														}
																																																																																																																													}
																																																																																																																												}
																																																																																																																											}
																																																																																																																										}
																																																																																																																									}
																																																																																																																								}
																																																																																																																							}
																																																																																																																						}
																																																																																																																					}
																																																																																																																				}
																																																																																																																			}
																																																																																																																		}
																																																																																																																	}
																																																																																																																}
																																																																																																															}
																																																																																																														}
																																																																																																													}
																																																																																																												}
																																																																																																											}
																																																																																																										}
																																																																																																									}
																																																																																																								}
																																																																																																							}
																																																																																																						}
																																																																																																					}
																																																																																																				}
																																																																																																			}
																																																																																																		}
																																																																																																	}
																																																																																																}
																																																																																															}
																																																																																														}
																																																																																													}
																																																																																												}
																																																																																											}
																																																																																										}
																																																																																									}
																																																																																								}
																																																																																							}
																																																																																						}
																																																																																					}
																																																																																				}
																																																																																			}
																																																																																		}
																																																																																	}
																																																																																}
																																																																															}
																																																																														}
																																																																													}
																																																																												}
																																																																											}
																																																																										}
																																																																									}
																																																																								}
																																																																							}
																																																																						}
																																																																					}
																																																																				}
																																																																			}
																																																																		}
																																																																	}
																																																																}
																																																															}
																																																														}
																																																													}
																																																												}
																																																											}
																																																										}
																																																									}
																																																								}
																																																							}
																																																						}
																																																					}
																																																				}
																																																			}
																																																		}
																																																	}
																																																}
																																															}
																																														}
																																													}
																																												}
																																											}
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _ohanhi$keyboard_extra$Keyboard_Extra$toCode = function (key) {
	return A2(
		_elm_lang$core$Maybe$withDefault,
		0,
		_elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(
					_elm_lang$core$List$filter,
					function (_p6) {
						return A2(
							F2(
								function (x, y) {
									return _elm_lang$core$Native_Utils.eq(x, y);
								}),
							key,
							_elm_lang$core$Tuple$second(_p6));
					},
					_ohanhi$keyboard_extra$Keyboard_Extra$codeBook))));
};
var _ohanhi$keyboard_extra$Keyboard_Extra$isPressed = F2(
	function (key, model) {
		return A2(
			_elm_lang$core$Set$member,
			_ohanhi$keyboard_extra$Keyboard_Extra$toCode(key),
			model.keysDown);
	});
var _ohanhi$keyboard_extra$Keyboard_Extra$codeDict = _elm_lang$core$Dict$fromList(_ohanhi$keyboard_extra$Keyboard_Extra$codeBook);
var _ohanhi$keyboard_extra$Keyboard_Extra$fromCode = function (code) {
	return A2(
		_elm_lang$core$Maybe$withDefault,
		_ohanhi$keyboard_extra$Keyboard_Extra$Other,
		A2(_elm_lang$core$Dict$get, code, _ohanhi$keyboard_extra$Keyboard_Extra$codeDict));
};
var _ohanhi$keyboard_extra$Keyboard_Extra$pressedDown = function (model) {
	return A2(
		_elm_lang$core$List$map,
		_ohanhi$keyboard_extra$Keyboard_Extra$fromCode,
		_elm_lang$core$Set$toList(model.keysDown));
};
var _ohanhi$keyboard_extra$Keyboard_Extra$targetKey = A2(
	_elm_lang$core$Json_Decode$map,
	_ohanhi$keyboard_extra$Keyboard_Extra$fromCode,
	A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int));

var _user$project$Rider_Model$Rider = F3(
	function (a, b, c) {
		return {id: a, name: b, licence: c};
	});
var _user$project$Rider_Model$Other = {ctor: 'Other'};
var _user$project$Rider_Model$Basislidmaatschap = {ctor: 'Basislidmaatschap'};
var _user$project$Rider_Model$Amateurs = {ctor: 'Amateurs'};
var _user$project$Rider_Model$Elite = {ctor: 'Elite'};

var _user$project$Account_Model$initial = _elm_lang$core$Maybe$Just(
	A3(_user$project$Rider_Model$Rider, 1, 'Michiel', _elm_lang$core$Maybe$Nothing));
var _user$project$Account_Model$signup = {name: ''};
var _user$project$Account_Model$login = {name: '', password: ''};
var _user$project$Account_Model$Login = F2(
	function (a, b) {
		return {name: a, password: b};
	});
var _user$project$Account_Model$Signup = function (a) {
	return {name: a};
};

var _user$project$App_Routing$url = function (route) {
	var _p0 = route;
	switch (_p0.ctor) {
		case 'Home':
			return '#home';
		case 'Riders':
			return '#riders';
		case 'RiderDetails':
			return A2(
				_elm_lang$core$Basics_ops['++'],
				'#riders/',
				_elm_lang$core$Basics$toString(_p0._0));
		case 'Races':
			return '#races';
		case 'RaceAdd':
			return '#races/add';
		case 'RaceDetails':
			return A2(
				_elm_lang$core$Basics_ops['++'],
				'#races/',
				_elm_lang$core$Basics$toString(_p0._0));
		case 'Results':
			return '#results';
		case 'ResultAdd':
			return A2(
				_elm_lang$core$Basics_ops['++'],
				'#races/',
				A2(
					_elm_lang$core$Basics_ops['++'],
					_elm_lang$core$Basics$toString(_p0._0),
					'/add'));
		case 'CommentAdd':
			return A2(
				_elm_lang$core$Basics_ops['++'],
				'#races/',
				A2(
					_elm_lang$core$Basics_ops['++'],
					_elm_lang$core$Basics$toString(_p0._0),
					'/comment'));
		case 'AccountLoginName':
			return A2(_elm_lang$core$Basics_ops['++'], '#account/login/', _p0._0);
		case 'AccountLogin':
			return '#account/login';
		case 'AccountLogout':
			return '#account/logout';
		case 'Account':
			return '#account';
		default:
			return '#account/signup';
	}
};
var _user$project$App_Routing$AccountSignup = {ctor: 'AccountSignup'};
var _user$project$App_Routing$AccountLogout = {ctor: 'AccountLogout'};
var _user$project$App_Routing$AccountLogin = {ctor: 'AccountLogin'};
var _user$project$App_Routing$AccountLoginName = function (a) {
	return {ctor: 'AccountLoginName', _0: a};
};
var _user$project$App_Routing$Account = {ctor: 'Account'};
var _user$project$App_Routing$CommentAdd = function (a) {
	return {ctor: 'CommentAdd', _0: a};
};
var _user$project$App_Routing$ResultAdd = function (a) {
	return {ctor: 'ResultAdd', _0: a};
};
var _user$project$App_Routing$Results = {ctor: 'Results'};
var _user$project$App_Routing$Races = {ctor: 'Races'};
var _user$project$App_Routing$RaceDetails = function (a) {
	return {ctor: 'RaceDetails', _0: a};
};
var _user$project$App_Routing$RaceAdd = {ctor: 'RaceAdd'};
var _user$project$App_Routing$Riders = {ctor: 'Riders'};
var _user$project$App_Routing$RiderDetails = function (a) {
	return {ctor: 'RiderDetails', _0: a};
};
var _user$project$App_Routing$matchers = _evancz$url_parser$UrlParser$oneOf(
	{
		ctor: '::',
		_0: A2(
			_evancz$url_parser$UrlParser$map,
			_user$project$App_Routing$Races,
			_evancz$url_parser$UrlParser$s('races')),
		_1: {
			ctor: '::',
			_0: A2(
				_evancz$url_parser$UrlParser$map,
				_user$project$App_Routing$Races,
				_evancz$url_parser$UrlParser$s('')),
			_1: {
				ctor: '::',
				_0: A2(
					_evancz$url_parser$UrlParser$map,
					_user$project$App_Routing$RiderDetails,
					A2(
						_evancz$url_parser$UrlParser_ops['</>'],
						_evancz$url_parser$UrlParser$s('riders'),
						_evancz$url_parser$UrlParser$int)),
				_1: {
					ctor: '::',
					_0: A2(
						_evancz$url_parser$UrlParser$map,
						_user$project$App_Routing$Riders,
						_evancz$url_parser$UrlParser$s('riders')),
					_1: {
						ctor: '::',
						_0: A2(
							_evancz$url_parser$UrlParser$map,
							_user$project$App_Routing$ResultAdd,
							A2(
								_evancz$url_parser$UrlParser_ops['</>'],
								_evancz$url_parser$UrlParser$s('races'),
								A2(
									_evancz$url_parser$UrlParser_ops['</>'],
									_evancz$url_parser$UrlParser$int,
									_evancz$url_parser$UrlParser$s('add')))),
						_1: {
							ctor: '::',
							_0: A2(
								_evancz$url_parser$UrlParser$map,
								_user$project$App_Routing$CommentAdd,
								A2(
									_evancz$url_parser$UrlParser_ops['</>'],
									_evancz$url_parser$UrlParser$s('races'),
									A2(
										_evancz$url_parser$UrlParser_ops['</>'],
										_evancz$url_parser$UrlParser$int,
										_evancz$url_parser$UrlParser$s('comment')))),
							_1: {
								ctor: '::',
								_0: A2(
									_evancz$url_parser$UrlParser$map,
									_user$project$App_Routing$RaceAdd,
									A2(
										_evancz$url_parser$UrlParser_ops['</>'],
										_evancz$url_parser$UrlParser$s('races'),
										_evancz$url_parser$UrlParser$s('add'))),
								_1: {
									ctor: '::',
									_0: A2(
										_evancz$url_parser$UrlParser$map,
										_user$project$App_Routing$RaceDetails,
										A2(
											_evancz$url_parser$UrlParser_ops['</>'],
											_evancz$url_parser$UrlParser$s('races'),
											_evancz$url_parser$UrlParser$int)),
									_1: {
										ctor: '::',
										_0: A2(
											_evancz$url_parser$UrlParser$map,
											_user$project$App_Routing$Races,
											_evancz$url_parser$UrlParser$s('races')),
										_1: {
											ctor: '::',
											_0: A2(
												_evancz$url_parser$UrlParser$map,
												_user$project$App_Routing$Results,
												_evancz$url_parser$UrlParser$s('results')),
											_1: {
												ctor: '::',
												_0: A2(
													_evancz$url_parser$UrlParser$map,
													_user$project$App_Routing$AccountLoginName,
													A2(
														_evancz$url_parser$UrlParser_ops['</>'],
														_evancz$url_parser$UrlParser$s('account'),
														A2(
															_evancz$url_parser$UrlParser_ops['</>'],
															_evancz$url_parser$UrlParser$s('login'),
															_evancz$url_parser$UrlParser$string))),
												_1: {
													ctor: '::',
													_0: A2(
														_evancz$url_parser$UrlParser$map,
														_user$project$App_Routing$AccountLogin,
														A2(
															_evancz$url_parser$UrlParser_ops['</>'],
															_evancz$url_parser$UrlParser$s('account'),
															_evancz$url_parser$UrlParser$s('login'))),
													_1: {
														ctor: '::',
														_0: A2(
															_evancz$url_parser$UrlParser$map,
															_user$project$App_Routing$AccountLogout,
															A2(
																_evancz$url_parser$UrlParser_ops['</>'],
																_evancz$url_parser$UrlParser$s('account'),
																_evancz$url_parser$UrlParser$s('logout'))),
														_1: {
															ctor: '::',
															_0: A2(
																_evancz$url_parser$UrlParser$map,
																_user$project$App_Routing$AccountSignup,
																A2(
																	_evancz$url_parser$UrlParser_ops['</>'],
																	_evancz$url_parser$UrlParser$s('account'),
																	_evancz$url_parser$UrlParser$s('signup'))),
															_1: {
																ctor: '::',
																_0: A2(
																	_evancz$url_parser$UrlParser$map,
																	_user$project$App_Routing$Account,
																	_evancz$url_parser$UrlParser$s('account')),
																_1: {ctor: '[]'}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$App_Routing$routeParser = function (location) {
	return A2(
		_elm_lang$core$Maybe$withDefault,
		_user$project$App_Routing$Races,
		A2(_evancz$url_parser$UrlParser$parseHash, _user$project$App_Routing$matchers, location));
};
var _user$project$App_Routing$Home = {ctor: 'Home'};

var _user$project$Race_Model$categoryString = function (category) {
	var _p0 = category;
	switch (_p0.ctor) {
		case 'Classic':
			return 'Klassieker';
		case 'Criterium':
			return 'Criterum';
		case 'Regiocross':
			return 'Regiocross';
		case 'Other':
			return 'Other';
		default:
			return 'Unknown';
	}
};
var _user$project$Race_Model$initialRaces = {ctor: '[]'};
var _user$project$Race_Model$Race = F4(
	function (a, b, c, d) {
		return {id: a, name: b, date: c, category: d};
	});
var _user$project$Race_Model$Add = F3(
	function (a, b, c) {
		return {name: a, category: b, calendar: c};
	});
var _user$project$Race_Model$Unknown = {ctor: 'Unknown'};
var _user$project$Race_Model$Other = {ctor: 'Other'};
var _user$project$Race_Model$Regiocross = {ctor: 'Regiocross'};
var _user$project$Race_Model$Criterium = {ctor: 'Criterium'};
var _user$project$Race_Model$Classic = {ctor: 'Classic'};

var _user$project$Result_Model$initialResults = {ctor: '[]'};
var _user$project$Result_Model$Result = F6(
	function (a, b, c, d, e, f) {
		return {id: a, riderId: b, raceId: c, result: d, category: e, strava: f};
	});
var _user$project$Result_Model$Add = F5(
	function (a, b, c, d, e) {
		return {raceId: a, result: b, category: c, strava: d, chooser: e};
	});
var _user$project$Result_Model$Unknown = {ctor: 'Unknown'};
var _user$project$Result_Model$CatB = {ctor: 'CatB'};
var _user$project$Result_Model$CatA = {ctor: 'CatA'};
var _user$project$Result_Model$Basislidmaatschap = {ctor: 'Basislidmaatschap'};
var _user$project$Result_Model$Amateurs = {ctor: 'Amateurs'};
var _user$project$Result_Model$initialAdd = {
	raceId: 0,
	result: '',
	category: _user$project$Result_Model$Amateurs,
	strava: '',
	chooser: A2(
		_gdotdesign$elm_ui$Ui_Chooser$searchable,
		true,
		A2(
			_gdotdesign$elm_ui$Ui_Chooser$closeOnSelect,
			true,
			_gdotdesign$elm_ui$Ui_Chooser$init(
				{ctor: '_Tuple0'})))
};
var _user$project$Result_Model$categories = {
	ctor: '::',
	_0: _user$project$Result_Model$Amateurs,
	_1: {
		ctor: '::',
		_0: _user$project$Result_Model$Basislidmaatschap,
		_1: {
			ctor: '::',
			_0: _user$project$Result_Model$CatA,
			_1: {
				ctor: '::',
				_0: _user$project$Result_Model$CatB,
				_1: {
					ctor: '::',
					_0: _user$project$Result_Model$Unknown,
					_1: {ctor: '[]'}
				}
			}
		}
	}
};

var _user$project$Comment_Model$initialAdd = {raceId: 0, riderName: '', text: ''};
var _user$project$Comment_Model$initialComments = {ctor: '[]'};
var _user$project$Comment_Model$empty = {id: 0, updatedAt: _elm_lang$core$Maybe$Nothing, raceId: 0, riderId: 0, text: ''};
var _user$project$Comment_Model$Comment = F5(
	function (a, b, c, d, e) {
		return {id: a, updatedAt: b, raceId: c, riderId: d, text: e};
	});
var _user$project$Comment_Model$Add = F3(
	function (a, b, c) {
		return {raceId: a, riderName: b, text: c};
	});

var _user$project$App_Msg$Chooser = function (a) {
	return {ctor: 'Chooser', _0: a};
};
var _user$project$App_Msg$Calendar = function (a) {
	return {ctor: 'Calendar', _0: a};
};
var _user$project$App_Msg$Ratings = function (a) {
	return {ctor: 'Ratings', _0: a};
};
var _user$project$App_Msg$DatePicked = function (a) {
	return {ctor: 'DatePicked', _0: a};
};
var _user$project$App_Msg$OnJoin = {ctor: 'OnJoin'};
var _user$project$App_Msg$OnJoinResponse = function (a) {
	return {ctor: 'OnJoinResponse', _0: a};
};
var _user$project$App_Msg$OnUpdatedRider = function (a) {
	return {ctor: 'OnUpdatedRider', _0: a};
};
var _user$project$App_Msg$OnCreatedComment = function (a) {
	return {ctor: 'OnCreatedComment', _0: a};
};
var _user$project$App_Msg$OnCreatedResult = function (a) {
	return {ctor: 'OnCreatedResult', _0: a};
};
var _user$project$App_Msg$OnCreatedRace = function (a) {
	return {ctor: 'OnCreatedRace', _0: a};
};
var _user$project$App_Msg$OnCreatedRider = function (a) {
	return {ctor: 'OnCreatedRider', _0: a};
};
var _user$project$App_Msg$HandleSendError = function (a) {
	return {ctor: 'HandleSendError', _0: a};
};
var _user$project$App_Msg$ReceiveRiders = function (a) {
	return {ctor: 'ReceiveRiders', _0: a};
};
var _user$project$App_Msg$ReceiveMessage = function (a) {
	return {ctor: 'ReceiveMessage', _0: a};
};
var _user$project$App_Msg$ConnectResponse = function (a) {
	return {ctor: 'ConnectResponse', _0: a};
};
var _user$project$App_Msg$PhoenixMsg = function (a) {
	return {ctor: 'PhoenixMsg', _0: a};
};
var _user$project$App_Msg$NewMessage = function (a) {
	return {ctor: 'NewMessage', _0: a};
};
var _user$project$App_Msg$Connect = {ctor: 'Connect'};
var _user$project$App_Msg$Noop = {ctor: 'Noop'};
var _user$project$App_Msg$UrlUpdate = function (a) {
	return {ctor: 'UrlUpdate', _0: a};
};
var _user$project$App_Msg$NavigateTo = function (a) {
	return {ctor: 'NavigateTo', _0: a};
};
var _user$project$App_Msg$SocketAccountSignupResponse = function (a) {
	return {ctor: 'SocketAccountSignupResponse', _0: a};
};
var _user$project$App_Msg$SocketAccountSignup = {ctor: 'SocketAccountSignup'};
var _user$project$App_Msg$SocketAccountLicenceResponse = function (a) {
	return {ctor: 'SocketAccountLicenceResponse', _0: a};
};
var _user$project$App_Msg$SocketAccountLicence = {ctor: 'SocketAccountLicence'};
var _user$project$App_Msg$AccountLicence = function (a) {
	return {ctor: 'AccountLicence', _0: a};
};
var _user$project$App_Msg$AccountSignupName = function (a) {
	return {ctor: 'AccountSignupName', _0: a};
};
var _user$project$App_Msg$AccountSignup = {ctor: 'AccountSignup'};
var _user$project$App_Msg$AccountLogout = {ctor: 'AccountLogout'};
var _user$project$App_Msg$AccountLoginPassword = function (a) {
	return {ctor: 'AccountLoginPassword', _0: a};
};
var _user$project$App_Msg$AccountLoginName = function (a) {
	return {ctor: 'AccountLoginName', _0: a};
};
var _user$project$App_Msg$AccountLogin = {ctor: 'AccountLogin'};
var _user$project$App_Msg$CommentAddSocketResponse = function (a) {
	return {ctor: 'CommentAddSocketResponse', _0: a};
};
var _user$project$App_Msg$CommentAdd = {ctor: 'CommentAdd'};
var _user$project$App_Msg$CommentAddSetRiderName = function (a) {
	return {ctor: 'CommentAddSetRiderName', _0: a};
};
var _user$project$App_Msg$CommentAddSetText = function (a) {
	return {ctor: 'CommentAddSetText', _0: a};
};
var _user$project$App_Msg$RidersSocketResponse = function (a) {
	return {ctor: 'RidersSocketResponse', _0: a};
};
var _user$project$App_Msg$RidersSocket = {ctor: 'RidersSocket'};
var _user$project$App_Msg$CommentsSocketResponse = function (a) {
	return {ctor: 'CommentsSocketResponse', _0: a};
};
var _user$project$App_Msg$CommentsSocket = {ctor: 'CommentsSocket'};
var _user$project$App_Msg$ResultsSocketResponse = function (a) {
	return {ctor: 'ResultsSocketResponse', _0: a};
};
var _user$project$App_Msg$ResultsSocket = {ctor: 'ResultsSocket'};
var _user$project$App_Msg$ResultAddResult = function (a) {
	return {ctor: 'ResultAddResult', _0: a};
};
var _user$project$App_Msg$ResultAddStrava = function (a) {
	return {ctor: 'ResultAddStrava', _0: a};
};
var _user$project$App_Msg$ResultAddCategory = function (a) {
	return {ctor: 'ResultAddCategory', _0: a};
};
var _user$project$App_Msg$ResultAddSocketResponse = function (a) {
	return {ctor: 'ResultAddSocketResponse', _0: a};
};
var _user$project$App_Msg$ResultAdd = {ctor: 'ResultAdd'};
var _user$project$App_Msg$RacesSocketResponse = function (a) {
	return {ctor: 'RacesSocketResponse', _0: a};
};
var _user$project$App_Msg$RacesSocket = {ctor: 'RacesSocket'};
var _user$project$App_Msg$RaceAddSocketResponse = function (a) {
	return {ctor: 'RaceAddSocketResponse', _0: a};
};
var _user$project$App_Msg$RaceAddCategory = function (a) {
	return {ctor: 'RaceAddCategory', _0: a};
};
var _user$project$App_Msg$RaceDate = function (a) {
	return {ctor: 'RaceDate', _0: a};
};
var _user$project$App_Msg$RaceName = function (a) {
	return {ctor: 'RaceName', _0: a};
};
var _user$project$App_Msg$RaceAdd = {ctor: 'RaceAdd'};

var _user$project$App_Flags$Flags = function (a) {
	return {wsUrl: a};
};

var _user$project$App_Model$App = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return {route: a, page: b, riders: c, races: d, results: e, comments: f, now: g, account: h, messages: i, phxSocket: j, connected: k, ratings: l};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$App_Model$NoOp = {ctor: 'NoOp'};
var _user$project$App_Model$initial = function (flags) {
	var channel = A2(
		_fbonetti$elm_phoenix_socket$Phoenix_Channel$onJoin,
		_elm_lang$core$Basics$always(_user$project$App_Msg$OnJoin),
		_fbonetti$elm_phoenix_socket$Phoenix_Channel$init('room:lobby'));
	var _p0 = A2(
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$join,
		channel,
		A4(
			_fbonetti$elm_phoenix_socket$Phoenix_Socket$on,
			'updatedRider',
			'room:lobby',
			_user$project$App_Msg$OnUpdatedRider,
			A4(
				_fbonetti$elm_phoenix_socket$Phoenix_Socket$on,
				'createdComment',
				'room:lobby',
				_user$project$App_Msg$OnCreatedComment,
				A4(
					_fbonetti$elm_phoenix_socket$Phoenix_Socket$on,
					'createdResult',
					'room:lobby',
					_user$project$App_Msg$OnCreatedResult,
					A4(
						_fbonetti$elm_phoenix_socket$Phoenix_Socket$on,
						'createdRace',
						'room:lobby',
						_user$project$App_Msg$OnCreatedRace,
						A4(
							_fbonetti$elm_phoenix_socket$Phoenix_Socket$on,
							'createdRider',
							'room:lobby',
							_user$project$App_Msg$OnCreatedRider,
							A4(
								_fbonetti$elm_phoenix_socket$Phoenix_Socket$on,
								'shout',
								'room:lobby',
								_user$project$App_Msg$ReceiveMessage,
								_fbonetti$elm_phoenix_socket$Phoenix_Socket$withDebug(
									_fbonetti$elm_phoenix_socket$Phoenix_Socket$init(flags.wsUrl)))))))));
	var initSocket = _p0._0;
	var phxCmd = _p0._1;
	return {
		ctor: '_Tuple2',
		_0: _user$project$App_Model$App(_user$project$App_Routing$Home)(_user$project$App_Model$NoOp)(_elm_lang$core$Maybe$Nothing)(_elm_lang$core$Maybe$Nothing)(_user$project$Result_Model$initialResults)(_elm_lang$core$Maybe$Nothing)(_elm_lang$core$Maybe$Nothing)(_user$project$Account_Model$initial)(
			{ctor: '[]'})(initSocket)(false)(
			A2(
				_gdotdesign$elm_ui$Ui_Ratings$size,
				10,
				_gdotdesign$elm_ui$Ui_Ratings$init(
					{ctor: '_Tuple0'}))),
		_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
	};
};
var _user$project$App_Model$CommentAdd = function (a) {
	return {ctor: 'CommentAdd', _0: a};
};
var _user$project$App_Model$ResultAdd = function (a) {
	return {ctor: 'ResultAdd', _0: a};
};
var _user$project$App_Model$AccountSignup = function (a) {
	return {ctor: 'AccountSignup', _0: a};
};
var _user$project$App_Model$AccountLogin = function (a) {
	return {ctor: 'AccountLogin', _0: a};
};
var _user$project$App_Model$RaceAdd = function (a) {
	return {ctor: 'RaceAdd', _0: a};
};

var _user$project$App_Helpers$getRaceById = F2(
	function (raceId, races) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (race) {
					return _elm_lang$core$Native_Utils.eq(race.id, raceId);
				},
				races));
	});
var _user$project$App_Helpers$getPointsByCategory = function (category) {
	var _p0 = category;
	switch (_p0.ctor) {
		case 'Classic':
			return 4;
		case 'Criterium':
			return 3;
		case 'Regiocross':
			return 2;
		case 'Other':
			return 0;
		default:
			return 0;
	}
};
var _user$project$App_Helpers$getPointsByResult = F2(
	function (result, races) {
		var _p1 = A2(_user$project$App_Helpers$getRaceById, result.raceId, races);
		if (_p1.ctor === 'Just') {
			return _user$project$App_Helpers$getPointsByCategory(_p1._0.category);
		} else {
			return 0;
		}
	});
var _user$project$App_Helpers$getPointsByResults = F2(
	function (results, races) {
		return _elm_lang$core$List$sum(
			A2(
				_elm_lang$core$List$map,
				function (result) {
					return A2(_user$project$App_Helpers$getPointsByResult, result, races);
				},
				results));
	});
var _user$project$App_Helpers$getPointsByRiderId = F3(
	function (riderId, results, races) {
		return A2(
			_user$project$App_Helpers$getPointsByResults,
			A2(
				_elm_lang$core$List$filter,
				function (result) {
					return _elm_lang$core$Native_Utils.eq(result.riderId, riderId);
				},
				results),
			races);
	});
var _user$project$App_Helpers$leadingZero = function (value) {
	return (_elm_lang$core$Native_Utils.cmp(value, 10) < 0) ? A2(
		_elm_lang$core$Basics_ops['++'],
		'0',
		_elm_lang$core$Basics$toString(value)) : _elm_lang$core$Basics$toString(value);
};
var _user$project$App_Helpers$formatTime = function (datetime) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_user$project$App_Helpers$leadingZero(
			_elm_lang$core$Date$hour(datetime)),
		A2(
			_elm_lang$core$Basics_ops['++'],
			':',
			_elm_lang$core$Basics$toString(
				_elm_lang$core$Date$minute(datetime))));
};
var _user$project$App_Helpers$numMonth = function (month) {
	var _p2 = month;
	switch (_p2.ctor) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		default:
			return 12;
	}
};
var _user$project$App_Helpers$formatDate = function (date) {
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_elm_lang$core$Basics$toString(
			_elm_lang$core$Date$year(date)),
		A2(
			_elm_lang$core$Basics_ops['++'],
			'-',
			A2(
				_elm_lang$core$Basics_ops['++'],
				_elm_lang$core$Basics$toString(
					_user$project$App_Helpers$numMonth(
						_elm_lang$core$Date$month(date))),
				A2(
					_elm_lang$core$Basics_ops['++'],
					'-',
					_user$project$App_Helpers$leadingZero(
						_elm_lang$core$Date$day(date))))));
};
var _user$project$App_Helpers$calcRaceId = function (races) {
	return _elm_lang$core$List$length(races) + 1;
};
var _user$project$App_Helpers$getRiderByResultId = F2(
	function (stringId, riders) {
		var _p3 = _elm_lang$core$String$toInt(stringId);
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$List$head(
				A2(
					_elm_lang$core$List$filter,
					function (rider) {
						return _elm_lang$core$Native_Utils.eq(rider.id, _p3._0);
					},
					riders));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _user$project$App_Helpers$getRiderByLowerCaseName = F2(
	function (name, riders) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (rider) {
					return _elm_lang$core$Native_Utils.eq(
						_elm_lang$core$String$toLower(rider.name),
						_elm_lang$core$String$toLower(name));
				},
				riders));
	});
var _user$project$App_Helpers$getRiderByName = F2(
	function (name, riders) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (rider) {
					return _elm_lang$core$Native_Utils.eq(rider.name, name);
				},
				riders));
	});
var _user$project$App_Helpers$updateRiderLicence = F3(
	function (riderId, maybeLicence, riders) {
		return A2(
			_elm_lang$core$List$map,
			function (rider) {
				var _p4 = _elm_lang$core$Native_Utils.eq(rider.id, riderId);
				if (_p4 === true) {
					return _elm_lang$core$Native_Utils.update(
						rider,
						{licence: maybeLicence});
				} else {
					return rider;
				}
			},
			riders);
	});
var _user$project$App_Helpers$navigate = function (route) {
	return _elm_lang$navigation$Navigation$newUrl(
		_user$project$App_Routing$url(route));
};

var _user$project$App_Encoder$resultCategory = function (category) {
	var _p0 = category;
	switch (_p0.ctor) {
		case 'Amateurs':
			return _elm_lang$core$Json_Encode$string('amateurs');
		case 'Basislidmaatschap':
			return _elm_lang$core$Json_Encode$string('basislidmaatschap');
		case 'CatA':
			return _elm_lang$core$Json_Encode$string('cata');
		case 'CatB':
			return _elm_lang$core$Json_Encode$string('catb');
		default:
			return _elm_lang$core$Json_Encode$string('unknown');
	}
};
var _user$project$App_Encoder$raceCategory = function (category) {
	var _p1 = category;
	switch (_p1.ctor) {
		case 'Classic':
			return _elm_lang$core$Json_Encode$string('classic');
		case 'Criterium':
			return _elm_lang$core$Json_Encode$string('criterum');
		case 'Regiocross':
			return _elm_lang$core$Json_Encode$string('regiocross');
		case 'Other':
			return _elm_lang$core$Json_Encode$string('other');
		default:
			return _elm_lang$core$Json_Encode$string('unknown');
	}
};
var _user$project$App_Encoder$licence = function (maybeLicence) {
	var _p2 = maybeLicence;
	if (_p2.ctor === 'Just') {
		switch (_p2._0.ctor) {
			case 'Elite':
				return _elm_lang$core$Json_Encode$string('elite');
			case 'Amateurs':
				return _elm_lang$core$Json_Encode$string('amateurs');
			case 'Basislidmaatschap':
				return _elm_lang$core$Json_Encode$string('basislidmaatschap');
			default:
				return _elm_lang$core$Json_Encode$string('other');
		}
	} else {
		return _elm_lang$core$Json_Encode$null;
	}
};

var _user$project$Account_Update$settingsLicenceSocketResponse = F2(
	function (rawResponse, app) {
		var _p0 = app.account;
		if (_p0.ctor === 'Just') {
			var nextAccount = _p0._0;
			var licence = A2(
				_elm_lang$core$Debug$log,
				'licence ',
				A2(
					_elm_lang$core$Result$withDefault,
					'',
					A2(
						_elm_lang$core$Json_Decode$decodeValue,
						A2(_elm_lang$core$Json_Decode$field, 'licence', _elm_lang$core$Json_Decode$string),
						rawResponse)));
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					app,
					{
						account: _elm_lang$core$Maybe$Just(nextAccount)
					}),
				_1: _elm_lang$core$Platform_Cmd$none
			};
		} else {
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$Account_Update$settingsLicenceSocket = function (app) {
	var _p1 = app.account;
	if (_p1.ctor === 'Just') {
		var _p3 = _p1._0;
		var payload = _elm_lang$core$Json_Encode$object(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'id',
					_1: _elm_lang$core$Json_Encode$int(_p3.id)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'licence',
						_1: _user$project$App_Encoder$licence(_p3.licence)
					},
					_1: {ctor: '[]'}
				}
			});
		var phxPush = A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
			_user$project$App_Msg$HandleSendError,
			A2(
				_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
				_user$project$App_Msg$SocketAccountLicenceResponse,
				A2(
					_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
					payload,
					A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'updateRider', 'room:lobby'))));
		var _p2 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, app.phxSocket);
		var phxSocket = _p2._0;
		var phxCmd = _p2._1;
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				app,
				{phxSocket: phxSocket}),
			_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
		};
	} else {
		return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
	}
};
var _user$project$Account_Update$settingsLicence = F2(
	function (licence, app) {
		var _p4 = app.account;
		if (_p4.ctor === 'Just') {
			var nextAccount = _elm_lang$core$Native_Utils.update(
				_p4._0,
				{
					licence: _elm_lang$core$Maybe$Just(licence)
				});
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					app,
					{
						account: _elm_lang$core$Maybe$Just(nextAccount)
					}),
				_1: _elm_lang$core$Platform_Cmd$batch(
					{
						ctor: '::',
						_0: A2(
							_elm_lang$core$Task$perform,
							_elm_lang$core$Basics$identity,
							_elm_lang$core$Task$succeed(_user$project$App_Msg$SocketAccountLicence)),
						_1: {ctor: '[]'}
					})
			};
		} else {
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$Account_Update$signupName = F2(
	function (name, app) {
		var _p5 = app.page;
		if (_p5.ctor === 'AccountSignup') {
			var nextAccountSignup = _elm_lang$core$Native_Utils.update(
				_p5._0,
				{name: name});
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					app,
					{
						page: _user$project$App_Model$AccountSignup(nextAccountSignup)
					}),
				_1: _elm_lang$core$Platform_Cmd$none
			};
		} else {
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$Account_Update$signupSocketResponse = F2(
	function (rawResponse, app) {
		var name = A2(
			_elm_lang$core$Result$withDefault,
			'',
			A2(
				_elm_lang$core$Json_Decode$decodeValue,
				A2(_elm_lang$core$Json_Decode$field, 'name', _elm_lang$core$Json_Decode$string),
				rawResponse));
		return {
			ctor: '_Tuple2',
			_0: app,
			_1: _user$project$App_Helpers$navigate(
				_user$project$App_Routing$AccountLoginName(name))
		};
	});
var _user$project$Account_Update$signupSocket = function (app) {
	var _p6 = app.page;
	if (_p6.ctor === 'AccountSignup') {
		var payload = _elm_lang$core$Json_Encode$object(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'name',
					_1: _elm_lang$core$Json_Encode$string(_p6._0.name)
				},
				_1: {ctor: '[]'}
			});
		var phxPush = A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
			_user$project$App_Msg$HandleSendError,
			A2(
				_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
				_user$project$App_Msg$SocketAccountSignupResponse,
				A2(
					_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
					payload,
					A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'createRider', 'room:lobby'))));
		var _p7 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, app.phxSocket);
		var phxSocket = _p7._0;
		var phxCmd = _p7._1;
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				app,
				{phxSocket: phxSocket}),
			_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
		};
	} else {
		return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
	}
};
var _user$project$Account_Update$signup = function (app) {
	var _p8 = app.page;
	if (_p8.ctor === 'AccountSignup') {
		var newRider = A3(
			_user$project$Rider_Model$Rider,
			_elm_lang$core$List$length(
				A2(
					_elm_lang$core$Maybe$withDefault,
					{ctor: '[]'},
					app.riders)) + 1,
			_p8._0.name,
			_elm_lang$core$Maybe$Nothing);
		return {
			ctor: '_Tuple2',
			_0: app,
			_1: _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: A2(
						_elm_lang$core$Task$perform,
						_elm_lang$core$Basics$identity,
						_elm_lang$core$Task$succeed(_user$project$App_Msg$SocketAccountSignup)),
					_1: {ctor: '[]'}
				})
		};
	} else {
		return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
	}
};
var _user$project$Account_Update$login = function (app) {
	var _p9 = app.page;
	if (_p9.ctor === 'AccountLogin') {
		var maybeRider = A2(
			_user$project$App_Helpers$getRiderByLowerCaseName,
			_p9._0.name,
			A2(
				_elm_lang$core$Maybe$withDefault,
				{ctor: '[]'},
				app.riders));
		var _p10 = maybeRider;
		if (_p10.ctor === 'Just') {
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					app,
					{account: maybeRider}),
				_1: _user$project$App_Helpers$navigate(_user$project$App_Routing$Home)
			};
		} else {
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	} else {
		return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
	}
};
var _user$project$Account_Update$logout = function (app) {
	var _p11 = app.account;
	if (_p11.ctor === 'Just') {
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				app,
				{account: _elm_lang$core$Maybe$Nothing}),
			_1: _user$project$App_Helpers$navigate(_user$project$App_Routing$Home)
		};
	} else {
		return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
	}
};
var _user$project$Account_Update$loginPassword = F2(
	function (password, app) {
		var _p12 = app.page;
		if (_p12.ctor === 'AccountLogin') {
			var nextAccountLogin = _elm_lang$core$Native_Utils.update(
				_p12._0,
				{password: password});
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					app,
					{
						page: _user$project$App_Model$AccountLogin(nextAccountLogin)
					}),
				_1: _elm_lang$core$Platform_Cmd$none
			};
		} else {
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$Account_Update$loginName = F2(
	function (name, app) {
		var _p13 = app.page;
		if (_p13.ctor === 'AccountLogin') {
			var nextAccountLogin = _elm_lang$core$Native_Utils.update(
				_p13._0,
				{name: name});
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					app,
					{
						page: _user$project$App_Model$AccountLogin(nextAccountLogin)
					}),
				_1: _elm_lang$core$Platform_Cmd$none
			};
		} else {
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});

var _user$project$Account_View$licenceRadio = F4(
	function (licenceName, licenceText, licence, maybeCurrentLicence) {
		var isChecked = function () {
			var _p0 = maybeCurrentLicence;
			if (_p0.ctor === 'Just') {
				return _elm_lang$core$Native_Utils.eq(licence, _p0._0);
			} else {
				return false;
			}
		}();
		return A2(
			_elm_lang$html$Html$p,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$input,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$id(licenceName),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$name('licence'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$type_('radio'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$checked(isChecked),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Events$onClick(
											_user$project$App_Msg$AccountLicence(licence)),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$label,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$for(licenceName),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(licenceText),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Account_View$licence = F2(
	function (app, account) {
		var licenceHeading = function () {
			var _p1 = account.licence;
			if (_p1.ctor === 'Just') {
				return {
					ctor: '::',
					_0: _elm_lang$html$Html$text('Change licence'),
					_1: {ctor: '[]'}
				};
			} else {
				return {
					ctor: '::',
					_0: _elm_lang$html$Html$text('Set licence'),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$span,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('new badge'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('1'),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				};
			}
		}();
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$h4,
					{ctor: '[]'},
					licenceHeading),
				_1: {
					ctor: '::',
					_0: A4(_user$project$Account_View$licenceRadio, 'elite', 'Elite', _user$project$Rider_Model$Elite, account.licence),
					_1: {
						ctor: '::',
						_0: A4(_user$project$Account_View$licenceRadio, 'amateurs', 'Amateurs', _user$project$Rider_Model$Amateurs, account.licence),
						_1: {
							ctor: '::',
							_0: A4(_user$project$Account_View$licenceRadio, 'basislidmaatschap', 'Basislidmaatschap', _user$project$Rider_Model$Basislidmaatschap, account.licence),
							_1: {
								ctor: '::',
								_0: A4(_user$project$Account_View$licenceRadio, 'other', 'Other', _user$project$Rider_Model$Other, account.licence),
								_1: {ctor: '[]'}
							}
						}
					}
				}
			});
	});
var _user$project$Account_View$signup = function (app) {
	var _p2 = app.page;
	if (_p2.ctor === 'AccountSignup') {
		var name = _elm_lang$core$String$trim(_p2._0.name);
		var submitDisabled = A2(_elm_lang$core$String$contains, '/', name) || (A2(_elm_lang$core$String$contains, '\\', name) || (A2(_elm_lang$core$String$contains, '&', name) || _elm_lang$core$Native_Utils.eq(name, '')));
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$h2,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Signup'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('row'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('input-field col s6'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$input,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$id('name'),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$type_('text'),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$value(name),
															_1: {
																ctor: '::',
																_0: _elm_lang$html$Html_Events$onInput(_user$project$App_Msg$AccountSignupName),
																_1: {ctor: '[]'}
															}
														}
													}
												},
												{ctor: '[]'}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$label,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$for('name'),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Name'),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$button,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('waves-effect waves-light btn'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$type_('submit'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Events$onClick(_user$project$App_Msg$AccountSignup),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$name('action'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$disabled(submitDisabled),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Signup'),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$i,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('material-icons right'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('send'),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}
							}),
						_1: {ctor: '[]'}
					}
				}
			});
	} else {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text('accoutSignup nothing'),
				_1: {ctor: '[]'}
			});
	}
};
var _user$project$Account_View$logout = function (app) {
	var _p3 = app.account;
	if (_p3.ctor === 'Just') {
		return A2(
			_elm_lang$html$Html$button,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('waves-effect waves-light btn'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$type_('submit'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_user$project$App_Msg$AccountLogout),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$name('action'),
							_1: {ctor: '[]'}
						}
					}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text('Logout'),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$i,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('material-icons right'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('send'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	} else {
		return A2(
			_elm_lang$html$Html$span,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text('Already logged out.'),
				_1: {ctor: '[]'}
			});
	}
};
var _user$project$Account_View$render = function (app) {
	var _p4 = app.account;
	if (_p4.ctor === 'Just') {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$h2,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Account'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(_user$project$Account_View$licence, app, _p4._0),
					_1: {
						ctor: '::',
						_0: _user$project$Account_View$logout(app),
						_1: {ctor: '[]'}
					}
				}
			});
	} else {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$h2,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Account'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Please login to see this page.'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	}
};
var _user$project$Account_View$riderNameExists = F2(
	function (riderName, riders) {
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(
				A2(
					_elm_lang$core$List$filter,
					function (rider) {
						return _elm_lang$core$Native_Utils.eq(
							_elm_lang$core$String$toLower(rider.name),
							_elm_lang$core$String$toLower(riderName));
					},
					riders)),
			1);
	});
var _user$project$Account_View$login = function (app) {
	var _p5 = app.page;
	if (_p5.ctor === 'AccountLogin') {
		var _p7 = _p5._0;
		var submitDisabled = function () {
			var _p6 = app.riders;
			if (_p6.ctor === 'Just') {
				return !A2(_user$project$Account_View$riderNameExists, _p7.name, _p6._0);
			} else {
				return false;
			}
		}();
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$h2,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Login'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('row'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('input-field col s6'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$input,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$id('name'),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class('autocomplete'),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$type_('text'),
															_1: {
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$value(_p7.name),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$html$Html_Events$onInput(_user$project$App_Msg$AccountLoginName),
																	_1: {ctor: '[]'}
																}
															}
														}
													}
												},
												{ctor: '[]'}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$label,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$for('name'),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Name'),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$button,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('waves-effect waves-light btn'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$type_('submit'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Events$onClick(_user$project$App_Msg$AccountLogin),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$name('action'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$disabled(submitDisabled),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Login'),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$i,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('material-icons right'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('send'),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}
							}),
						_1: {ctor: '[]'}
					}
				}
			});
	} else {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text('accountLogin nothing'),
				_1: {ctor: '[]'}
			});
	}
};

var _user$project$App_Decoder$page = A2(_elm_lang$core$Json_Decode$field, 'page', _elm_lang$core$Json_Decode$string);
var _user$project$App_Decoder$resultCategory = function (string) {
	var _p0 = string;
	switch (_p0) {
		case 'amateurs':
			return _user$project$Result_Model$Amateurs;
		case 'basislidmaatschap':
			return _user$project$Result_Model$Basislidmaatschap;
		case 'cata':
			return _user$project$Result_Model$CatA;
		case 'catb':
			return _user$project$Result_Model$CatB;
		default:
			return _user$project$Result_Model$Unknown;
	}
};
var _user$project$App_Decoder$decodeResultCategory = function (string) {
	return _elm_lang$core$Json_Decode$succeed(
		_user$project$App_Decoder$resultCategory(string));
};
var _user$project$App_Decoder$result = A7(
	_elm_lang$core$Json_Decode$map6,
	_user$project$Result_Model$Result,
	A2(_elm_lang$core$Json_Decode$field, 'id', _elm_lang$core$Json_Decode$int),
	A2(_elm_lang$core$Json_Decode$field, 'riderId', _elm_lang$core$Json_Decode$int),
	A2(_elm_lang$core$Json_Decode$field, 'raceId', _elm_lang$core$Json_Decode$int),
	A2(_elm_lang$core$Json_Decode$field, 'result', _elm_lang$core$Json_Decode$string),
	A2(
		_elm_lang$core$Json_Decode$field,
		'category',
		A2(_elm_lang$core$Json_Decode$andThen, _user$project$App_Decoder$decodeResultCategory, _elm_lang$core$Json_Decode$string)),
	A2(
		_elm_lang$core$Json_Decode$field,
		'strava',
		_elm_lang$core$Json_Decode$maybe(_elm_lang$core$Json_Decode$string)));
var _user$project$App_Decoder$licence = function (string) {
	var _p1 = string;
	switch (_p1) {
		case 'elite':
			return _elm_lang$core$Maybe$Just(_user$project$Rider_Model$Elite);
		case 'amateurs':
			return _elm_lang$core$Maybe$Just(_user$project$Rider_Model$Amateurs);
		case 'basislidmaatschap':
			return _elm_lang$core$Maybe$Just(_user$project$Rider_Model$Basislidmaatschap);
		default:
			return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$App_Decoder$date = function () {
	var convert = function (raw) {
		var _p2 = _elm_lang$core$Date$fromString(raw);
		if (_p2.ctor === 'Ok') {
			return _elm_lang$core$Json_Decode$succeed(
				_elm_lang$core$Maybe$Just(_p2._0));
		} else {
			return _elm_lang$core$Json_Decode$succeed(_elm_lang$core$Maybe$Nothing);
		}
	};
	return A2(_elm_lang$core$Json_Decode$andThen, convert, _elm_lang$core$Json_Decode$string);
}();
var _user$project$App_Decoder$commentDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'text',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'riderId',
		_elm_lang$core$Json_Decode$int,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'raceId',
			_elm_lang$core$Json_Decode$int,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'updatedAt',
				_user$project$App_Decoder$date,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'id',
					_elm_lang$core$Json_Decode$int,
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Comment_Model$Comment))))));
var _user$project$App_Decoder$comment = A6(
	_elm_lang$core$Json_Decode$map5,
	_user$project$Comment_Model$Comment,
	A2(_elm_lang$core$Json_Decode$field, 'id', _elm_lang$core$Json_Decode$int),
	A2(_elm_lang$core$Json_Decode$field, 'updatedAt', _user$project$App_Decoder$date),
	A2(_elm_lang$core$Json_Decode$field, 'raceId', _elm_lang$core$Json_Decode$int),
	A2(_elm_lang$core$Json_Decode$field, 'riderId', _elm_lang$core$Json_Decode$int),
	A2(_elm_lang$core$Json_Decode$field, 'text', _elm_lang$core$Json_Decode$string));
var _user$project$App_Decoder$resultCategoryDecoder = function (string) {
	var _p3 = string;
	switch (_p3) {
		case 'amateurs':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Result_Model$Amateurs);
		case 'basislidmaatschap':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Result_Model$Basislidmaatschap);
		case 'cata':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Result_Model$CatA);
		case 'catb':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Result_Model$CatB);
		case 'unknown':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Result_Model$Unknown);
		default:
			return _elm_lang$core$Json_Decode$succeed(_user$project$Result_Model$Unknown);
	}
};
var _user$project$App_Decoder$resultDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'strava',
	_elm_lang$core$Json_Decode$nullable(_elm_lang$core$Json_Decode$string),
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'category',
		A2(_elm_lang$core$Json_Decode$andThen, _user$project$App_Decoder$resultCategoryDecoder, _elm_lang$core$Json_Decode$string),
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'result',
			_elm_lang$core$Json_Decode$string,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'raceId',
				_elm_lang$core$Json_Decode$int,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'riderId',
					_elm_lang$core$Json_Decode$int,
					A3(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
						'id',
						_elm_lang$core$Json_Decode$int,
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Result_Model$Result)))))));
var _user$project$App_Decoder$raceCategoryDecoder = function (string) {
	var _p4 = string;
	switch (_p4) {
		case 'classic':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Race_Model$Classic);
		case 'criterum':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Race_Model$Criterium);
		case 'regiocross':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Race_Model$Regiocross);
		case 'other':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Race_Model$Other);
		case 'unknown':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Race_Model$Unknown);
		default:
			return _elm_lang$core$Json_Decode$succeed(_user$project$Race_Model$Unknown);
	}
};
var _user$project$App_Decoder$raceDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'category',
	A2(_elm_lang$core$Json_Decode$andThen, _user$project$App_Decoder$raceCategoryDecoder, _elm_lang$core$Json_Decode$string),
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'date',
		_user$project$App_Decoder$date,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'name',
			_elm_lang$core$Json_Decode$string,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'id',
				_elm_lang$core$Json_Decode$int,
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Race_Model$Race)))));
var _user$project$App_Decoder$licenceDecoder = function (string) {
	var _p5 = string;
	switch (_p5) {
		case 'elite':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Rider_Model$Elite);
		case 'amateurs':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Rider_Model$Amateurs);
		case 'basislidmaatschap':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Rider_Model$Basislidmaatschap);
		case 'other':
			return _elm_lang$core$Json_Decode$succeed(_user$project$Rider_Model$Other);
		default:
			return _elm_lang$core$Json_Decode$fail(
				A2(_elm_lang$core$Basics_ops['++'], string, ' licence does not exists.'));
	}
};
var _user$project$App_Decoder$riderDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'licence',
	_elm_lang$core$Json_Decode$nullable(
		A2(_elm_lang$core$Json_Decode$andThen, _user$project$App_Decoder$licenceDecoder, _elm_lang$core$Json_Decode$string)),
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'name',
		_elm_lang$core$Json_Decode$string,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'id',
			_elm_lang$core$Json_Decode$int,
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Rider_Model$Rider))));
var _user$project$App_Decoder$decodeLicence = function (string) {
	return _elm_lang$core$Json_Decode$succeed(
		_user$project$App_Decoder$licence(string));
};
var _user$project$App_Decoder$rider = A4(
	_elm_lang$core$Json_Decode$map3,
	_user$project$Rider_Model$Rider,
	A2(_elm_lang$core$Json_Decode$field, 'id', _elm_lang$core$Json_Decode$int),
	A2(_elm_lang$core$Json_Decode$field, 'name', _elm_lang$core$Json_Decode$string),
	A2(
		_elm_lang$core$Json_Decode$field,
		'licence',
		A2(_elm_lang$core$Json_Decode$andThen, _user$project$App_Decoder$decodeLicence, _elm_lang$core$Json_Decode$string)));
var _user$project$App_Decoder$category = function (string) {
	var _p6 = string;
	switch (_p6) {
		case 'Klassieker':
			return _user$project$Race_Model$Classic;
		case 'Criterium':
			return _user$project$Race_Model$Criterium;
		case 'Regiocross':
			return _user$project$Race_Model$Regiocross;
		case 'Other':
			return _user$project$Race_Model$Other;
		default:
			return _user$project$Race_Model$Unknown;
	}
};
var _user$project$App_Decoder$decodeCategory = function (string) {
	return _elm_lang$core$Json_Decode$succeed(
		_user$project$App_Decoder$category(string));
};
var _user$project$App_Decoder$App = F4(
	function (a, b, c, d) {
		return {page: a, riders: b, comments: c, results: d};
	});
var _user$project$App_Decoder$app = A5(
	_elm_lang$core$Json_Decode$map4,
	_user$project$App_Decoder$App,
	A2(_elm_lang$core$Json_Decode$field, 'page', _elm_lang$core$Json_Decode$string),
	A2(
		_elm_lang$core$Json_Decode$field,
		'riders',
		_elm_lang$core$Json_Decode$list(_user$project$App_Decoder$rider)),
	A2(
		_elm_lang$core$Json_Decode$field,
		'comments',
		_elm_lang$core$Json_Decode$list(_user$project$App_Decoder$comment)),
	A2(
		_elm_lang$core$Json_Decode$field,
		'results',
		_elm_lang$core$Json_Decode$list(_user$project$App_Decoder$result)));

var _user$project$App_UrlUpdate$fetchForRoute = function (route) {
	var _p0 = route;
	switch (_p0.ctor) {
		case 'RaceAdd':
			return _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: A2(
						_elm_lang$core$Task$attempt,
						_elm_lang$core$Basics$always(_user$project$App_Msg$Noop),
						_elm_lang$dom$Dom$focus('name')),
					_1: {ctor: '[]'}
				});
		case 'CommentAdd':
			return _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: A2(
						_elm_lang$core$Task$attempt,
						_elm_lang$core$Basics$always(_user$project$App_Msg$Noop),
						_elm_lang$dom$Dom$focus('text')),
					_1: {ctor: '[]'}
				});
		case 'AccountLogin':
			return _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: A2(
						_elm_lang$core$Task$perform,
						_elm_lang$core$Basics$identity,
						_elm_lang$core$Task$succeed(_user$project$App_Msg$Connect)),
					_1: {ctor: '[]'}
				});
		case 'ResultAdd':
			return _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: A2(
						_elm_lang$core$Task$attempt,
						_elm_lang$core$Basics$always(_user$project$App_Msg$Noop),
						_elm_lang$dom$Dom$focus('result')),
					_1: {ctor: '[]'}
				});
		case 'Races':
			return _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: A2(
						_elm_lang$core$Task$perform,
						_elm_lang$core$Basics$identity,
						_elm_lang$core$Task$succeed(_user$project$App_Msg$RacesSocket)),
					_1: {ctor: '[]'}
				});
		default:
			return _elm_lang$core$Platform_Cmd$none;
	}
};
var _user$project$App_UrlUpdate$resultExists = F3(
	function (riderId, raceId, results) {
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(
				A2(
					_elm_lang$core$List$filter,
					function (result) {
						return _elm_lang$core$Native_Utils.eq(result.riderId, riderId) && _elm_lang$core$Native_Utils.eq(result.raceId, raceId);
					},
					results)),
			1);
	});
var _user$project$App_UrlUpdate$onUrlEnter = F2(
	function (route, app) {
		var _p1 = route;
		switch (_p1.ctor) {
			case 'AccountLogin':
				var _p2 = app.account;
				if (_p2.ctor === 'Just') {
					return {
						ctor: '_Tuple2',
						_0: app,
						_1: _user$project$App_Helpers$navigate(_user$project$App_Routing$Account)
					};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								page: _user$project$App_Model$AccountLogin(_user$project$Account_Model$login)
							}),
						_1: _user$project$App_UrlUpdate$fetchForRoute(_user$project$App_Routing$AccountLogin)
					};
				}
			case 'AccountLoginName':
				var _p3 = app.account;
				if (_p3.ctor === 'Just') {
					return {
						ctor: '_Tuple2',
						_0: app,
						_1: _user$project$App_Helpers$navigate(_user$project$App_Routing$Account)
					};
				} else {
					var accountLogin = _user$project$Account_Model$login;
					var nextAccountLogin = _elm_lang$core$Native_Utils.update(
						accountLogin,
						{name: _p1._0});
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								page: _user$project$App_Model$AccountLogin(nextAccountLogin)
							}),
						_1: _user$project$App_UrlUpdate$fetchForRoute(_user$project$App_Routing$AccountLogin)
					};
				}
			case 'ResultAdd':
				var _p10 = _p1._0;
				var _p4 = app.account;
				if (_p4.ctor === 'Nothing') {
					var _p5 = A2(_elm_lang$core$Debug$log, 'nothing', 'app.account');
					return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
				} else {
					var _p9 = _p4._0;
					var _p6 = app.riders;
					if (_p6.ctor === 'Nothing') {
						var _p7 = A2(_elm_lang$core$Debug$log, 'nothing', 'app.riders');
						return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
					} else {
						var filteredRiders = A2(
							_elm_lang$core$List$filter,
							function (rider) {
								return !A3(_user$project$App_UrlUpdate$resultExists, rider.id, _p10, app.results);
							},
							_p6._0);
						var items = A2(
							_elm_lang$core$List$map,
							function (rider) {
								return {
									id: _elm_lang$core$Basics$toString(rider.id),
									label: rider.name,
									value: _elm_lang$core$Basics$toString(rider.id)
								};
							},
							filteredRiders);
						var accountInFilteredRiders = _elm_lang$core$Native_Utils.eq(
							_elm_lang$core$List$length(
								A2(
									_elm_lang$core$List$filter,
									function (rider) {
										return _elm_lang$core$Native_Utils.eq(rider.id, _p9.id);
									},
									filteredRiders)),
							1);
						var resultAdd = _user$project$Result_Model$initialAdd;
						var chooser = function () {
							var _p8 = accountInFilteredRiders;
							if (_p8 === true) {
								return A2(
									_gdotdesign$elm_ui$Ui_Chooser$setValue,
									_elm_lang$core$Basics$toString(_p9.id),
									A2(_gdotdesign$elm_ui$Ui_Chooser$items, items, resultAdd.chooser));
							} else {
								return A2(_gdotdesign$elm_ui$Ui_Chooser$items, items, resultAdd.chooser);
							}
						}();
						var resultAddWithRaceId = _elm_lang$core$Native_Utils.update(
							resultAdd,
							{raceId: _p10, chooser: chooser});
						return {
							ctor: '_Tuple2',
							_0: _elm_lang$core$Native_Utils.update(
								app,
								{
									page: _user$project$App_Model$ResultAdd(resultAddWithRaceId)
								}),
							_1: _user$project$App_UrlUpdate$fetchForRoute(
								_user$project$App_Routing$ResultAdd(_p10))
						};
					}
				}
			case 'CommentAdd':
				var _p12 = _p1._0;
				var _p11 = app.account;
				if (_p11.ctor === 'Just') {
					var b = A2(_elm_lang$core$Debug$log, 'urlUpdate CommentAdd', _p12);
					var riderName = _p11._0.name;
					var a = A2(_elm_lang$core$Debug$log, 'urlUpdate CommentAdd', riderName);
					var commentAdd = _user$project$Comment_Model$initialAdd;
					var commentAddWithRaceId = _elm_lang$core$Native_Utils.update(
						commentAdd,
						{raceId: _p12, riderName: riderName});
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								page: _user$project$App_Model$CommentAdd(commentAddWithRaceId)
							}),
						_1: _user$project$App_UrlUpdate$fetchForRoute(
							_user$project$App_Routing$CommentAdd(_p12))
					};
				} else {
					return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'RaceAdd':
				var raceAdd = A3(
					_user$project$Race_Model$Add,
					'',
					_user$project$Race_Model$Classic,
					_gdotdesign$elm_ui$Ui_Calendar$init(
						{ctor: '_Tuple0'}));
				var a = A2(_elm_lang$core$Debug$log, 'urlUpdate', 'RacesAdd');
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{
							page: _user$project$App_Model$RaceAdd(raceAdd)
						}),
					_1: _user$project$App_UrlUpdate$fetchForRoute(_user$project$App_Routing$RaceAdd)
				};
			case 'AccountSignup':
				var _p13 = app.account;
				if (_p13.ctor === 'Just') {
					return {
						ctor: '_Tuple2',
						_0: app,
						_1: _user$project$App_Helpers$navigate(_user$project$App_Routing$Account)
					};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								page: _user$project$App_Model$AccountSignup(_user$project$Account_Model$signup)
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				}
			case 'RaceDetails':
				var cmd = _elm_lang$core$Platform_Cmd$batch(
					{
						ctor: '::',
						_0: A2(
							_elm_lang$core$Task$perform,
							_elm_lang$core$Basics$identity,
							_elm_lang$core$Task$succeed(_user$project$App_Msg$RacesSocket)),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$core$Task$perform,
								_elm_lang$core$Basics$identity,
								_elm_lang$core$Task$succeed(_user$project$App_Msg$ResultsSocket)),
							_1: {ctor: '[]'}
						}
					});
				return {ctor: '_Tuple2', _0: app, _1: cmd};
			default:
				return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$App_UrlUpdate$onUrlLeave = F2(
	function (prevRoute, prevApp) {
		var _p14 = prevRoute;
		return _elm_lang$core$Native_Utils.update(
			prevApp,
			{page: _user$project$App_Model$NoOp});
	});
var _user$project$App_UrlUpdate$urlUpdate = F2(
	function (route, app) {
		var prevRoute = app.route;
		var leaveApp = A2(_user$project$App_UrlUpdate$onUrlLeave, prevRoute, app);
		var routeApp = _elm_lang$core$Native_Utils.update(
			leaveApp,
			{route: route});
		return A2(_user$project$App_UrlUpdate$onUrlEnter, route, routeApp);
	});

var _user$project$Result_Helpers$calcResultId = function (results) {
	return _elm_lang$core$List$length(results) + 1;
};
var _user$project$Result_Helpers$resultExists = F2(
	function (result, results) {
		return !_elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(
				A2(
					_elm_lang$core$List$filter,
					function (r) {
						return _elm_lang$core$Native_Utils.eq(r.raceId, result.raceId) && _elm_lang$core$Native_Utils.eq(r.riderId, result.riderId);
					},
					results)),
			0);
	});

var _user$project$Result_Update$resultsSocketResponse = F2(
	function (message, app) {
		var resultResults = A2(
			_elm_lang$core$Json_Decode$decodeValue,
			A2(
				_elm_lang$core$Json_Decode$field,
				'results',
				_elm_lang$core$Json_Decode$list(_user$project$App_Decoder$resultDecoder)),
			message);
		var _p0 = resultResults;
		if (_p0.ctor === 'Ok') {
			var _p2 = _p0._0;
			var _p1 = app.page;
			if (_p1.ctor === 'NoOp') {
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{results: _p2}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			} else {
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{results: _p2}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			}
		} else {
			var b = A2(_elm_lang$core$Debug$log, 'result socket response', _p0._0);
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$Result_Update$resultsSocket = function (app) {
	var payload = _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'name',
				_1: _elm_lang$core$Json_Encode$string('hoi')
			},
			_1: {ctor: '[]'}
		});
	var phxPush = A2(
		_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
		_user$project$App_Msg$HandleSendError,
		A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
			_user$project$App_Msg$ResultsSocketResponse,
			A2(
				_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
				payload,
				A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'results', 'room:lobby'))));
	var _p3 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, app.phxSocket);
	var phxSocket = _p3._0;
	var phxCmd = _p3._1;
	var _p4 = A2(_elm_lang$core$Debug$log, 'results', 'socket');
	return {
		ctor: '_Tuple2',
		_0: _elm_lang$core$Native_Utils.update(
			app,
			{phxSocket: phxSocket}),
		_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
	};
};
var _user$project$Result_Update$addSocketResponse = function (rawResponse) {
	var _p5 = A2(
		_elm_lang$core$Json_Decode$decodeValue,
		A2(_elm_lang$core$Json_Decode$field, 'raceId', _elm_lang$core$Json_Decode$int),
		rawResponse);
	if (_p5.ctor === 'Ok') {
		var _p7 = _p5._0;
		var _p6 = A2(_elm_lang$core$Debug$log, 'raceId', _p7);
		return _elm_lang$core$Maybe$Just(
			_user$project$App_Helpers$navigate(
				_user$project$App_Routing$RaceDetails(_p7)));
	} else {
		var _p8 = A2(_elm_lang$core$Debug$log, 'addSocketResponse Err', _p5._0);
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Result_Update$addResult = F2(
	function (value, resultAdd) {
		return _elm_lang$core$Native_Utils.update(
			resultAdd,
			{result: value});
	});
var _user$project$Result_Update$addStrava = F2(
	function (link, resultAdd) {
		return _elm_lang$core$Native_Utils.update(
			resultAdd,
			{strava: link});
	});
var _user$project$Result_Update$addCategory = F2(
	function (category, resultAdd) {
		return _elm_lang$core$Native_Utils.update(
			resultAdd,
			{category: category});
	});
var _user$project$Result_Update$add = F4(
	function (resultAdd, riders, results, phxSocket) {
		var _p9 = _elm_lang$core$List$head(
			_elm_lang$core$Set$toList(resultAdd.chooser.selected));
		if (_p9.ctor === 'Just') {
			var _p10 = _elm_lang$core$String$toInt(_p9._0);
			if (_p10.ctor === 'Err') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var payload = _elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'riderId',
							_1: _elm_lang$core$Json_Encode$int(_p10._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'raceId',
								_1: _elm_lang$core$Json_Encode$int(resultAdd.raceId)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'result',
									_1: _elm_lang$core$Json_Encode$string(resultAdd.result)
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'category',
										_1: _user$project$App_Encoder$resultCategory(resultAdd.category)
									},
									_1: {
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'strava',
											_1: _elm_lang$core$Json_Encode$string(resultAdd.strava)
										},
										_1: {ctor: '[]'}
									}
								}
							}
						}
					});
				var phxPush = A2(
					_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
					_user$project$App_Msg$HandleSendError,
					A2(
						_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
						_user$project$App_Msg$ResultAddSocketResponse,
						A2(
							_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
							payload,
							A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'createResult', 'room:lobby'))));
				var _p11 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, phxSocket);
				var nextPhxSocket = _p11._0;
				var phxCmd = _p11._1;
				return _elm_lang$core$Maybe$Just(
					{
						ctor: '_Tuple2',
						_0: nextPhxSocket,
						_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
					});
			}
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

var _user$project$Comment_Update$getRiderByName = F2(
	function (name, riders) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (rider) {
					return _elm_lang$core$Native_Utils.eq(rider.name, name);
				},
				riders));
	});
var _user$project$Comment_Update$addSocketResponse = function (rawResponse) {
	var _p0 = A2(
		_elm_lang$core$Json_Decode$decodeValue,
		A2(_elm_lang$core$Json_Decode$field, 'raceId', _elm_lang$core$Json_Decode$int),
		rawResponse);
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(
			_user$project$App_Helpers$navigate(
				_user$project$App_Routing$RaceDetails(_p0._0)));
	} else {
		var _p1 = A2(_elm_lang$core$Debug$log, 'addSocketResponse error', _p0._0);
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Comment_Update$commentsSocketResponse = F2(
	function (message, app) {
		var resultComments = A2(
			_elm_lang$core$Json_Decode$decodeValue,
			A2(
				_elm_lang$core$Json_Decode$field,
				'comments',
				_elm_lang$core$Json_Decode$list(_user$project$App_Decoder$commentDecoder)),
			message);
		var _p2 = resultComments;
		if (_p2.ctor === 'Ok') {
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					app,
					{
						comments: _elm_lang$core$Maybe$Just(_p2._0)
					}),
				_1: _elm_lang$core$Platform_Cmd$none
			};
		} else {
			var b = A2(_elm_lang$core$Debug$log, 'comments socket response', _p2._0);
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$Comment_Update$commentsSocket = function (app) {
	var payload = _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'name',
				_1: _elm_lang$core$Json_Encode$string('hoi')
			},
			_1: {ctor: '[]'}
		});
	var phxPush = A2(
		_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
		_user$project$App_Msg$HandleSendError,
		A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
			_user$project$App_Msg$CommentsSocketResponse,
			A2(
				_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
				payload,
				A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'comments', 'room:lobby'))));
	var _p3 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, app.phxSocket);
	var phxSocket = _p3._0;
	var phxCmd = _p3._1;
	var _p4 = A2(_elm_lang$core$Debug$log, 'comments', 'socket');
	return {
		ctor: '_Tuple2',
		_0: _elm_lang$core$Native_Utils.update(
			app,
			{phxSocket: phxSocket}),
		_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
	};
};
var _user$project$Comment_Update$addRiderName = F2(
	function (name, commentAdd) {
		return _elm_lang$core$Native_Utils.update(
			commentAdd,
			{riderName: name});
	});
var _user$project$Comment_Update$addText = F2(
	function (text, commentAdd) {
		return _elm_lang$core$Native_Utils.update(
			commentAdd,
			{text: text});
	});
var _user$project$Comment_Update$addSocket = F3(
	function (commentAdd, riderId, phxSocket) {
		var payload = _elm_lang$core$Json_Encode$object(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'riderId',
					_1: _elm_lang$core$Json_Encode$int(riderId)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'raceId',
						_1: _elm_lang$core$Json_Encode$int(commentAdd.raceId)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'text',
							_1: _elm_lang$core$Json_Encode$string(commentAdd.text)
						},
						_1: {ctor: '[]'}
					}
				}
			});
		var phxPush = A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
			_user$project$App_Msg$HandleSendError,
			A2(
				_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
				_user$project$App_Msg$CommentAddSocketResponse,
				A2(
					_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
					payload,
					A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'createComment', 'room:lobby'))));
		var _p5 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, phxSocket);
		var nextPhxSocket = _p5._0;
		var phxCmd = _p5._1;
		return {
			ctor: '_Tuple2',
			_0: nextPhxSocket,
			_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
		};
	});
var _user$project$Comment_Update$add = F3(
	function (commentAdd, riders, phxSocket) {
		var _p6 = A2(_user$project$Comment_Update$getRiderByName, commentAdd.riderName, riders);
		if (_p6.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				A3(_user$project$Comment_Update$addSocket, commentAdd, _p6._0.id, phxSocket));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

var _user$project$Race_Update$addSocketResponse = function (rawResponse) {
	var _p0 = A2(
		_elm_lang$core$Json_Decode$decodeValue,
		A2(_elm_lang$core$Json_Decode$field, 'id', _elm_lang$core$Json_Decode$int),
		rawResponse);
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(
			_user$project$App_Helpers$navigate(
				_user$project$App_Routing$RaceDetails(_p0._0)));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Race_Update$dateFormat = function (date) {
	return A3(_rluiten$elm_date_extra$Date_Extra_Format$format, _rluiten$elm_date_extra$Date_Extra_Config_Config_nl_nl$config, '%Y-%m-%d 00:00:00', date);
};
var _user$project$Race_Update$addSocket = F2(
	function (raceAdd, phxSocket) {
		var dateString = _user$project$Race_Update$dateFormat(raceAdd.calendar.value);
		var payload = _elm_lang$core$Json_Encode$object(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'name',
					_1: _elm_lang$core$Json_Encode$string(raceAdd.name)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'date',
						_1: _elm_lang$core$Json_Encode$string(dateString)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'category',
							_1: _user$project$App_Encoder$raceCategory(raceAdd.category)
						},
						_1: {ctor: '[]'}
					}
				}
			});
		var phxPush = A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
			_user$project$App_Msg$HandleSendError,
			A2(
				_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
				_user$project$App_Msg$RaceAddSocketResponse,
				A2(
					_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
					payload,
					A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'createRace', 'room:lobby'))));
		var _p1 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, phxSocket);
		var nextPhxSocket = _p1._0;
		var phxCmd = _p1._1;
		return {
			ctor: '_Tuple2',
			_0: nextPhxSocket,
			_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
		};
	});
var _user$project$Race_Update$racesSocketResponse = F2(
	function (message, app) {
		var resultRaces = A2(
			_elm_lang$core$Json_Decode$decodeValue,
			A2(
				_elm_lang$core$Json_Decode$field,
				'races',
				_elm_lang$core$Json_Decode$list(_user$project$App_Decoder$raceDecoder)),
			message);
		var _p2 = resultRaces;
		if (_p2.ctor === 'Ok') {
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					app,
					{
						races: _elm_lang$core$Maybe$Just(_p2._0)
					}),
				_1: _elm_lang$core$Platform_Cmd$none
			};
		} else {
			var b = A2(_elm_lang$core$Debug$log, 'races socket response', _p2._0);
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$Race_Update$racesSocket = function (app) {
	var payload = _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'name',
				_1: _elm_lang$core$Json_Encode$string('hoi')
			},
			_1: {ctor: '[]'}
		});
	var phxPush = A2(
		_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
		_user$project$App_Msg$HandleSendError,
		A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
			_user$project$App_Msg$RacesSocketResponse,
			A2(
				_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
				payload,
				A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'races', 'room:lobby'))));
	var _p3 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, app.phxSocket);
	var phxSocket = _p3._0;
	var phxCmd = _p3._1;
	var _p4 = A2(_elm_lang$core$Debug$log, 'races', 'socket');
	return {
		ctor: '_Tuple2',
		_0: _elm_lang$core$Native_Utils.update(
			app,
			{phxSocket: phxSocket}),
		_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
	};
};
var _user$project$Race_Update$addCategory = F2(
	function (category, raceAdd) {
		return _elm_lang$core$Native_Utils.update(
			raceAdd,
			{category: category});
	});
var _user$project$Race_Update$addName = F2(
	function (newName, raceAdd) {
		return _elm_lang$core$Native_Utils.update(
			raceAdd,
			{name: newName});
	});
var _user$project$Race_Update$addPage = F2(
	function (msg, maybeRaceAdd) {
		var _p5 = maybeRaceAdd;
		if (_p5.ctor === 'Just') {
			var _p7 = _p5._0;
			var _p6 = msg;
			switch (_p6.ctor) {
				case 'RaceName':
					return _elm_lang$core$Maybe$Just(
						A2(_user$project$Race_Update$addName, _p6._0, _p7));
				case 'RaceAddCategory':
					return _elm_lang$core$Maybe$Just(
						A2(_user$project$Race_Update$addCategory, _p6._0, _p7));
				default:
					return _elm_lang$core$Maybe$Nothing;
			}
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _user$project$Race_Update$addPage2 = F2(
	function (msg, page) {
		var _p8 = page;
		if (_p8.ctor === 'RaceAdd') {
			var _p10 = _p8._0;
			var _p9 = msg;
			switch (_p9.ctor) {
				case 'RaceName':
					return _user$project$App_Model$RaceAdd(
						A2(_user$project$Race_Update$addName, _p9._0, _p10));
				case 'RaceAddCategory':
					return _user$project$App_Model$RaceAdd(
						A2(_user$project$Race_Update$addCategory, _p9._0, _p10));
				default:
					return page;
			}
		} else {
			return page;
		}
	});
var _user$project$Race_Update$add = F2(
	function (raceAdd, phxSocket) {
		var _p11 = _elm_lang$core$String$isEmpty(raceAdd.name);
		if (_p11 === false) {
			return _elm_lang$core$Maybe$Just(
				A2(_user$project$Race_Update$addSocket, raceAdd, phxSocket));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

var _user$project$Rider_Update$ridersSocketResponse = F2(
	function (message, app) {
		var resultResults = A2(
			_elm_lang$core$Json_Decode$decodeValue,
			A2(
				_elm_lang$core$Json_Decode$field,
				'riders',
				_elm_lang$core$Json_Decode$list(_user$project$App_Decoder$riderDecoder)),
			message);
		var _p0 = resultResults;
		if (_p0.ctor === 'Ok') {
			var _p3 = _p0._0;
			var _p1 = app.page;
			if (_p1.ctor === 'NoOp') {
				var _p2 = app.route;
				if (_p2.ctor === 'ResultAdd') {
					return A2(
						_user$project$App_UrlUpdate$onUrlEnter,
						_user$project$App_Routing$ResultAdd(_p2._0),
						_elm_lang$core$Native_Utils.update(
							app,
							{
								riders: _elm_lang$core$Maybe$Just(_p3)
							}));
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								riders: _elm_lang$core$Maybe$Just(_p3)
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				}
			} else {
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{
							riders: _elm_lang$core$Maybe$Just(_p3)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			}
		} else {
			var b = A2(_elm_lang$core$Debug$log, 'riders socket response', _p0._0);
			return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$Rider_Update$ridersSocket = function (app) {
	var payload = _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'name',
				_1: _elm_lang$core$Json_Encode$string('hoi')
			},
			_1: {ctor: '[]'}
		});
	var phxPush = A2(
		_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
		_user$project$App_Msg$HandleSendError,
		A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
			_user$project$App_Msg$RidersSocketResponse,
			A2(
				_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
				payload,
				A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'riders', 'room:lobby'))));
	var _p4 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, app.phxSocket);
	var phxSocket = _p4._0;
	var phxCmd = _p4._1;
	var _p5 = A2(_elm_lang$core$Debug$log, 'riders', 'socket');
	return {
		ctor: '_Tuple2',
		_0: _elm_lang$core$Native_Utils.update(
			app,
			{phxSocket: phxSocket}),
		_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
	};
};

var _user$project$App_Update$update = F2(
	function (msg, app) {
		var noOp = {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'RaceAdd':
				var _p1 = app.page;
				if (_p1.ctor === 'RaceAdd') {
					var _p2 = A2(_user$project$Race_Update$add, _p1._0, app.phxSocket);
					if (_p2.ctor === 'Just') {
						return {
							ctor: '_Tuple2',
							_0: _elm_lang$core$Native_Utils.update(
								app,
								{phxSocket: _p2._0._0}),
							_1: _p2._0._1
						};
					} else {
						return noOp;
					}
				} else {
					return noOp;
				}
			case 'RaceAddSocketResponse':
				var _p3 = _user$project$Race_Update$addSocketResponse(_p0._0);
				if (_p3.ctor === 'Just') {
					return {ctor: '_Tuple2', _0: app, _1: _p3._0};
				} else {
					return noOp;
				}
			case 'RaceName':
				var page = A2(_user$project$Race_Update$addPage2, msg, app.page);
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						app,
						{page: page}),
					{ctor: '[]'});
			case 'RaceAddCategory':
				var page = A2(_user$project$Race_Update$addPage2, msg, app.page);
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						app,
						{page: page}),
					{ctor: '[]'});
			case 'RaceDate':
				var page = A2(_user$project$Race_Update$addPage2, msg, app.page);
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						app,
						{page: page}),
					{ctor: '[]'});
			case 'ResultAdd':
				var _p4 = app.page;
				if (_p4.ctor === 'ResultAdd') {
					var _p5 = app.riders;
					if (_p5.ctor === 'Just') {
						var _p6 = A4(_user$project$Result_Update$add, _p4._0, _p5._0, app.results, app.phxSocket);
						if (_p6.ctor === 'Just') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Native_Utils.update(
									app,
									{phxSocket: _p6._0._0}),
								_1: _p6._0._1
							};
						} else {
							return noOp;
						}
					} else {
						return noOp;
					}
				} else {
					return noOp;
				}
			case 'ResultAddSocketResponse':
				var _p7 = _user$project$Result_Update$addSocketResponse(_p0._0);
				if (_p7.ctor === 'Just') {
					return {ctor: '_Tuple2', _0: app, _1: _p7._0};
				} else {
					return noOp;
				}
			case 'ResultAddCategory':
				return {
					ctor: '_Tuple2',
					_0: function () {
						var _p8 = app.page;
						if (_p8.ctor === 'ResultAdd') {
							return _elm_lang$core$Native_Utils.update(
								app,
								{
									page: _user$project$App_Model$ResultAdd(
										A2(_user$project$Result_Update$addCategory, _p0._0, _p8._0))
								});
						} else {
							return app;
						}
					}(),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ResultAddStrava':
				return {
					ctor: '_Tuple2',
					_0: function () {
						var _p9 = app.page;
						if (_p9.ctor === 'ResultAdd') {
							return _elm_lang$core$Native_Utils.update(
								app,
								{
									page: _user$project$App_Model$ResultAdd(
										A2(_user$project$Result_Update$addStrava, _p0._0, _p9._0))
								});
						} else {
							return app;
						}
					}(),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ResultAddResult':
				return {
					ctor: '_Tuple2',
					_0: function () {
						var _p10 = app.page;
						if (_p10.ctor === 'ResultAdd') {
							return _elm_lang$core$Native_Utils.update(
								app,
								{
									page: _user$project$App_Model$ResultAdd(
										A2(_user$project$Result_Update$addResult, _p0._0, _p10._0))
								});
						} else {
							return app;
						}
					}(),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ResultsSocket':
				return _user$project$Result_Update$resultsSocket(app);
			case 'ResultsSocketResponse':
				return A2(_user$project$Result_Update$resultsSocketResponse, _p0._0, app);
			case 'CommentsSocket':
				return _user$project$Comment_Update$commentsSocket(app);
			case 'CommentsSocketResponse':
				return A2(_user$project$Comment_Update$commentsSocketResponse, _p0._0, app);
			case 'CommentAddSetText':
				return {
					ctor: '_Tuple2',
					_0: function () {
						var _p11 = app.page;
						if (_p11.ctor === 'CommentAdd') {
							return _elm_lang$core$Native_Utils.update(
								app,
								{
									page: _user$project$App_Model$CommentAdd(
										A2(_user$project$Comment_Update$addText, _p0._0, _p11._0))
								});
						} else {
							return app;
						}
					}(),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'CommentAddSetRiderName':
				return {
					ctor: '_Tuple2',
					_0: function () {
						var _p12 = app.page;
						if (_p12.ctor === 'CommentAdd') {
							return _elm_lang$core$Native_Utils.update(
								app,
								{
									page: _user$project$App_Model$CommentAdd(
										A2(_user$project$Comment_Update$addRiderName, _p0._0, _p12._0))
								});
						} else {
							return app;
						}
					}(),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'CommentAdd':
				var _p13 = app.page;
				if (_p13.ctor === 'CommentAdd') {
					var _p14 = app.riders;
					if (_p14.ctor === 'Just') {
						var _p15 = A3(_user$project$Comment_Update$add, _p13._0, _p14._0, app.phxSocket);
						if (_p15.ctor === 'Just') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Native_Utils.update(
									app,
									{phxSocket: _p15._0._0}),
								_1: _p15._0._1
							};
						} else {
							return noOp;
						}
					} else {
						return noOp;
					}
				} else {
					return noOp;
				}
			case 'CommentAddSocketResponse':
				var _p16 = _user$project$Comment_Update$addSocketResponse(_p0._0);
				if (_p16.ctor === 'Just') {
					return {ctor: '_Tuple2', _0: app, _1: _p16._0};
				} else {
					return noOp;
				}
			case 'UrlUpdate':
				return A2(_user$project$App_UrlUpdate$urlUpdate, _p0._0, app);
			case 'NavigateTo':
				return {
					ctor: '_Tuple2',
					_0: app,
					_1: _user$project$App_Helpers$navigate(_p0._0)
				};
			case 'AccountLogin':
				return _user$project$Account_Update$login(app);
			case 'AccountLoginName':
				return A2(_user$project$Account_Update$loginName, _p0._0, app);
			case 'AccountLoginPassword':
				return A2(_user$project$Account_Update$loginPassword, _p0._0, app);
			case 'AccountLogout':
				return _user$project$Account_Update$logout(app);
			case 'AccountSignup':
				return _user$project$Account_Update$signup(app);
			case 'SocketAccountSignup':
				return _user$project$Account_Update$signupSocket(app);
			case 'SocketAccountSignupResponse':
				return A2(_user$project$Account_Update$signupSocketResponse, _p0._0, app);
			case 'AccountSignupName':
				return A2(_user$project$Account_Update$signupName, _p0._0, app);
			case 'AccountLicence':
				return A2(_user$project$Account_Update$settingsLicence, _p0._0, app);
			case 'SocketAccountLicence':
				return _user$project$Account_Update$settingsLicenceSocket(app);
			case 'SocketAccountLicenceResponse':
				return A2(_user$project$Account_Update$settingsLicenceSocketResponse, _p0._0, app);
			case 'RacesSocket':
				return _user$project$Race_Update$racesSocket(app);
			case 'RacesSocketResponse':
				return A2(_user$project$Race_Update$racesSocketResponse, _p0._0, app);
			case 'RidersSocket':
				return _user$project$Rider_Update$ridersSocket(app);
			case 'RidersSocketResponse':
				return A2(_user$project$Rider_Update$ridersSocketResponse, _p0._0, app);
			case 'OnJoinResponse':
				var _p17 = A2(_elm_lang$core$Debug$log, 'OnJoinResponse', _p0._0);
				return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
			case 'OnCreatedRider':
				var riderResult = A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$App_Decoder$riderDecoder, _p0._0);
				var _p18 = riderResult;
				if (_p18.ctor === 'Ok') {
					var _p19 = _p18._0;
					var newRider = A3(_user$project$Rider_Model$Rider, _p19.id, _p19.name, _p19.licence);
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								riders: _elm_lang$core$Maybe$Just(
									{
										ctor: '::',
										_0: newRider,
										_1: A2(
											_elm_lang$core$Maybe$withDefault,
											{ctor: '[]'},
											app.riders)
									})
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return noOp;
				}
			case 'OnCreatedRace':
				var raceResult = A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$App_Decoder$raceDecoder, _p0._0);
				var _p20 = raceResult;
				if (_p20.ctor === 'Ok') {
					var _p21 = _p20._0;
					var newRace = A4(_user$project$Race_Model$Race, _p21.id, _p21.name, _p21.date, _p21.category);
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								races: _elm_lang$core$Maybe$Just(
									{
										ctor: '::',
										_0: newRace,
										_1: A2(
											_elm_lang$core$Maybe$withDefault,
											{ctor: '[]'},
											app.races)
									})
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return noOp;
				}
			case 'OnCreatedResult':
				var resultResult = A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$App_Decoder$resultDecoder, _p0._0);
				var _p22 = resultResult;
				if (_p22.ctor === 'Ok') {
					var _p23 = _p22._0;
					var newResult = A6(_user$project$Result_Model$Result, _p23.id, _p23.riderId, _p23.raceId, _p23.result, _user$project$Result_Model$CatA, _p23.strava);
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								results: {ctor: '::', _0: newResult, _1: app.results}
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return noOp;
				}
			case 'OnCreatedComment':
				var commentResult = A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$App_Decoder$commentDecoder, _p0._0);
				var _p24 = commentResult;
				if (_p24.ctor === 'Ok') {
					var _p25 = _p24._0;
					var newComment = A5(_user$project$Comment_Model$Comment, _p25.id, _p25.updatedAt, _p25.raceId, _p25.riderId, _p25.text);
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								comments: _elm_lang$core$Maybe$Just(
									{
										ctor: '::',
										_0: newComment,
										_1: A2(
											_elm_lang$core$Maybe$withDefault,
											{ctor: '[]'},
											app.comments)
									})
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return noOp;
				}
			case 'OnUpdatedRider':
				var riderResult = A2(
					_elm_lang$core$Debug$log,
					'riderResult in onUpdatedRider',
					A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$App_Decoder$riderDecoder, _p0._0));
				var _p26 = riderResult;
				if (_p26.ctor === 'Ok') {
					var _p30 = _p26._0;
					var nextAccount = function () {
						var _p27 = app.account;
						if (_p27.ctor === 'Just') {
							var _p29 = _p27._0;
							var _p28 = _elm_lang$core$Native_Utils.eq(_p29.id, _p30.id);
							if (_p28 === true) {
								return _elm_lang$core$Maybe$Just(
									_elm_lang$core$Native_Utils.update(
										_p29,
										{licence: _p30.licence}));
							} else {
								return _elm_lang$core$Maybe$Just(_p29);
							}
						} else {
							return _elm_lang$core$Maybe$Nothing;
						}
					}();
					var riders = A2(
						_elm_lang$core$Debug$log,
						'updatedRiders: ',
						A3(
							_user$project$App_Helpers$updateRiderLicence,
							_p30.id,
							_p30.licence,
							A2(
								_elm_lang$core$Maybe$withDefault,
								{ctor: '[]'},
								app.riders)));
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								riders: _elm_lang$core$Maybe$Just(riders),
								account: nextAccount
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return noOp;
				}
			case 'Noop':
				return noOp;
			case 'Connect':
				var _p31 = A2(_elm_lang$core$Debug$log, 'Connect', 'connect');
				var payload = _elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'body',
							_1: _elm_lang$core$Json_Encode$string('bodyValue')
						},
						_1: {ctor: '[]'}
					});
				var phxPush = A2(
					_fbonetti$elm_phoenix_socket$Phoenix_Push$onError,
					_user$project$App_Msg$HandleSendError,
					A2(
						_fbonetti$elm_phoenix_socket$Phoenix_Push$onOk,
						_user$project$App_Msg$ConnectResponse,
						A2(
							_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
							payload,
							A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'init', 'room:lobby'))));
				var _p32 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, phxPush, app.phxSocket);
				var phxSocket = _p32._0;
				var phxCmd = _p32._1;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{phxSocket: phxSocket}),
					_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
				};
			case 'ConnectResponse':
				var _p33 = A2(_elm_lang$core$Debug$log, 'ConnectResponse', _p0._0);
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{connected: true}),
					_1: A2(
						_elm_lang$core$Task$perform,
						_elm_lang$core$Basics$identity,
						_elm_lang$core$Task$succeed(_user$project$App_Msg$RidersSocket))
				};
			case 'ReceiveRiders':
				var _p35 = _p0._0;
				var messages = {
					ctor: '::',
					_0: _elm_lang$core$Basics$toString(_p35),
					_1: app.messages
				};
				var resultRiders = A2(
					_elm_lang$core$Json_Decode$decodeValue,
					A2(
						_elm_lang$core$Json_Decode$field,
						'riders',
						_elm_lang$core$Json_Decode$list(_user$project$App_Decoder$riderDecoder)),
					_p35);
				var _p34 = resultRiders;
				if (_p34.ctor === 'Ok') {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{
								messages: messages,
								riders: _elm_lang$core$Maybe$Just(_p34._0)
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{messages: messages}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				}
			case 'ReceiveMessage':
				var _p36 = A2(_elm_lang$core$Debug$log, 'receiveMessage', _p0._0);
				return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
			case 'HandleSendError':
				return noOp;
			case 'NewMessage':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{
							messages: {ctor: '::', _0: _p0._0, _1: app.messages}
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'PhoenixMsg':
				var _p37 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$update, _p0._0, app.phxSocket);
				var phxSocket = _p37._0;
				var phxCmd = _p37._1;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{phxSocket: phxSocket}),
					_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$PhoenixMsg, phxCmd)
				};
			case 'OnJoin':
				var _p38 = A2(_elm_lang$core$Debug$log, 'onJoin', 'success');
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{connected: true}),
					_1: _elm_lang$core$Platform_Cmd$batch(
						{
							ctor: '::',
							_0: A2(
								_elm_lang$core$Task$perform,
								_elm_lang$core$Basics$identity,
								_elm_lang$core$Task$succeed(_user$project$App_Msg$RidersSocket)),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$core$Task$perform,
									_elm_lang$core$Basics$identity,
									_elm_lang$core$Task$succeed(_user$project$App_Msg$RacesSocket)),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$core$Task$perform,
										_elm_lang$core$Basics$identity,
										_elm_lang$core$Task$succeed(_user$project$App_Msg$ResultsSocket)),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$core$Task$perform,
											_elm_lang$core$Basics$identity,
											_elm_lang$core$Task$succeed(_user$project$App_Msg$CommentsSocket)),
										_1: {ctor: '[]'}
									}
								}
							}
						})
				};
			case 'DatePicked':
				var _p39 = app.page;
				if (_p39.ctor === 'RaceAdd') {
					var page = A2(
						_user$project$Race_Update$addPage2,
						_user$project$App_Msg$RaceDate(_p0._0),
						app.page);
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{page: page}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return {ctor: '_Tuple2', _0: app, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'Ratings':
				var _p40 = A2(_gdotdesign$elm_ui$Ui_Ratings$update, _p0._0, app.ratings);
				var ratings = _p40._0;
				var cmd = _p40._1;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						app,
						{ratings: ratings}),
					_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$Ratings, cmd)
				};
			case 'Calendar':
				var _p41 = app.page;
				if (_p41.ctor === 'RaceAdd') {
					var _p43 = _p41._0;
					var _p42 = A2(_gdotdesign$elm_ui$Ui_Calendar$update, _p0._0, _p43.calendar);
					var calendar = _p42._0;
					var cmd = _p42._1;
					var nextRaceAdd = _user$project$App_Model$RaceAdd(
						_elm_lang$core$Native_Utils.update(
							_p43,
							{calendar: calendar}));
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{page: nextRaceAdd}),
						_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$Calendar, cmd)
					};
				} else {
					return noOp;
				}
			default:
				var _p44 = app.page;
				if (_p44.ctor === 'ResultAdd') {
					var _p46 = _p44._0;
					var _p45 = A2(_gdotdesign$elm_ui$Ui_Chooser$update, _p0._0, _p46.chooser);
					var chooser = _p45._0;
					var cmd = _p45._1;
					var nextResultAdd = _user$project$App_Model$ResultAdd(
						_elm_lang$core$Native_Utils.update(
							_p46,
							{chooser: chooser}));
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							app,
							{page: nextResultAdd}),
						_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$App_Msg$Chooser, cmd)
					};
				} else {
					return noOp;
				}
		}
	});

var _user$project$Race_View_Add$datepicker = function (dateString) {
	var inputDate = A2(
		_elm_lang$core$Debug$log,
		'dateString',
		A2(
			_elm_lang$core$String$join,
			'/',
			A2(_elm_lang$core$String$split, '-', dateString)));
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('col s6'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$label,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('active'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Date'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A3(
					_elm_lang$html$Html$node,
					'app-datepicker',
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$id('datepicker'),
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$html$Html_Attributes$attribute, 'first-day-of-week', '1'),
							_1: {
								ctor: '::',
								_0: A2(_elm_lang$html$Html_Attributes$attribute, 'input-date', inputDate),
								_1: {
									ctor: '::',
									_0: A2(_elm_lang$html$Html_Attributes$attribute, 'disable-days', '[]'),
									_1: {
										ctor: '::',
										_0: A2(_elm_lang$html$Html_Attributes$attribute, 'auto-update-date', 'true'),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					},
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Race_View_Add$categoryButtonCheck = F4(
	function (categoryName, categoryText, categoryModel, current) {
		var isChecked = _elm_lang$core$Native_Utils.eq(categoryModel, current);
		return A2(
			_elm_lang$html$Html$p,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$input,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$checked(isChecked),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$name('category'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$type_('radio'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$id(categoryName),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Events$onClick(
											_user$project$App_Msg$RaceAddCategory(categoryModel)),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$label,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$for(categoryName),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(categoryText),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Race_View_Add$categoryButtons = function (current) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('col s6'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$label,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('active'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Category'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A4(_user$project$Race_View_Add$categoryButtonCheck, 'classic', 'Klassieker', _user$project$Race_Model$Classic, current),
				_1: {
					ctor: '::',
					_0: A4(_user$project$Race_View_Add$categoryButtonCheck, 'criterum', 'Criterium', _user$project$Race_Model$Criterium, current),
					_1: {
						ctor: '::',
						_0: A4(_user$project$Race_View_Add$categoryButtonCheck, 'regiocross', 'Regiocross', _user$project$Race_Model$Regiocross, current),
						_1: {
							ctor: '::',
							_0: A4(_user$project$Race_View_Add$categoryButtonCheck, 'other', 'Other', _user$project$Race_Model$Other, current),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
};
var _user$project$Race_View_Add$dateFormat = function (date) {
	return A3(_rluiten$elm_date_extra$Date_Extra_Format$format, _rluiten$elm_date_extra$Date_Extra_Config_Config_nl_nl$config, '%Y-%m-%d', date);
};
var _user$project$Race_View_Add$render = function (raceAdd) {
	var dateString = _user$project$Race_View_Add$dateFormat(raceAdd.calendar.value);
	var name = raceAdd.name;
	var submitDisabled = _elm_lang$core$Native_Utils.eq(name, '');
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$h2,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Add Race'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('row'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('col s6 input-field'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$input,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$id('name'),
												_1: {
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$type_('text'),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Events$onInput(_user$project$App_Msg$RaceName),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$autofocus(true),
															_1: {
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$value(name),
																_1: {ctor: '[]'}
															}
														}
													}
												}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$label,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$for('name'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Name'),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('row'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _user$project$Race_View_Add$categoryButtons(raceAdd.category),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$map,
											_user$project$App_Msg$Calendar,
											A2(_gdotdesign$elm_ui$Ui_Calendar$view, 'en_us', raceAdd.calendar)),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('row'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('col s6'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$button,
														{
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$class('waves-effect waves-light btn'),
															_1: {
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$type_('submit'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$html$Html_Events$onClick(_user$project$App_Msg$RaceAdd),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$html$Html_Attributes$name('action'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$html$Html_Attributes$disabled(submitDisabled),
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Add Race'),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$html$Html$i,
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html_Attributes$class('material-icons right'),
																		_1: {ctor: '[]'}
																	},
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html$text('send'),
																		_1: {ctor: '[]'}
																	}),
																_1: {ctor: '[]'}
															}
														}),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: {ctor: '[]'}
			}
		});
};

var _user$project$Race_View_List$countParticipants = F2(
	function (raceId, results) {
		return _elm_lang$core$List$length(
			A2(
				_elm_lang$core$List$filter,
				function (result) {
					return _elm_lang$core$Native_Utils.eq(result.raceId, raceId);
				},
				results));
	});
var _user$project$Race_View_List$addButton = function (loggedIn) {
	var _p0 = loggedIn;
	if (_p0 === true) {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$a,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$href('#races/add'),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('waves-effect waves-light btn'),
							_1: {ctor: '[]'}
						}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Add race'),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	} else {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{ctor: '[]'});
	}
};
var _user$project$Race_View_List$dateFormat = function (date) {
	return A3(_rluiten$elm_date_extra$Date_Extra_Format$format, _rluiten$elm_date_extra$Date_Extra_Config_Config_nl_nl$config, '%d-%m-%Y', date);
};
var _user$project$Race_View_List$raceTable = F2(
	function (races, results) {
		return A2(
			_elm_lang$html$Html$table,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$thead,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$tr,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$th,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Name'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$th,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Date'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$th,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Category'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$th,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Riders'),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}
								}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$tbody,
						{ctor: '[]'},
						A2(
							_elm_lang$core$List$map,
							function (race) {
								var dateString = function () {
									var _p1 = race.date;
									if (_p1.ctor === 'Just') {
										return _user$project$Race_View_List$dateFormat(_p1._0);
									} else {
										return '1970-01-01';
									}
								}();
								return A2(
									_elm_lang$html$Html$tr,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$td,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$a,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$href(
															A2(
																_elm_lang$core$Basics_ops['++'],
																'#races/',
																_elm_lang$core$Basics$toString(race.id))),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text(race.name),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$td,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(dateString),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$td,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text(
															_elm_lang$core$Basics$toString(race.category)),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$td,
														{ctor: '[]'},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text(
																_elm_lang$core$Basics$toString(
																	A2(_user$project$Race_View_List$countParticipants, race.id, results))),
															_1: {ctor: '[]'}
														}),
													_1: {ctor: '[]'}
												}
											}
										}
									});
							},
							races)),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Race_View_List$render = F3(
	function (loggedIn, races, results) {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$h2,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Races'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: _user$project$Race_View_List$addButton(loggedIn),
					_1: {
						ctor: '::',
						_0: A2(_user$project$Race_View_List$raceTable, races, results),
						_1: {ctor: '[]'}
					}
				}
			});
	});

var _user$project$Comment_View_List$commentRow = F2(
	function (comment, maybeRider) {
		var _p0 = maybeRider;
		if (_p0.ctor === 'Nothing') {
			return A2(
				_elm_lang$html$Html$tr,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$td,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('RiderId does not exist'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				});
		} else {
			var _p1 = _p0._0;
			return A2(
				_elm_lang$html$Html$tr,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$td,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(
								_elm_lang$core$Basics$toString(comment.id)),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$td,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$a,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$href(
											A2(
												_elm_lang$core$Basics_ops['++'],
												'#riders/',
												_elm_lang$core$Basics$toString(_p1.id))),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(_p1.name),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$td,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(comment.text),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$td,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(comment.text),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						}
					}
				});
		}
	});
var _user$project$Comment_View_List$getRiderById = F2(
	function (id, riders) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (rider) {
					return _elm_lang$core$Native_Utils.eq(rider.id, id);
				},
				riders));
	});
var _user$project$Comment_View_List$filterCommentsByRace = function (race) {
	return _elm_lang$core$List$filter(
		function (comment) {
			return _elm_lang$core$Native_Utils.eq(comment.raceId, race.id);
		});
};
var _user$project$Comment_View_List$commentsTable = F3(
	function (comments, race, riders) {
		return A2(
			_elm_lang$html$Html$table,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$thead,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$tr,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$th,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('id'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$th,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Rider'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$th,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Datum'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$th,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Text'),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}
								}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$tbody,
						{ctor: '[]'},
						A2(
							_elm_lang$core$List$map,
							function (comment) {
								return A2(
									_user$project$Comment_View_List$commentRow,
									comment,
									A2(_user$project$Comment_View_List$getRiderById, comment.riderId, riders));
							},
							A2(_user$project$Comment_View_List$filterCommentsByRace, race, comments))),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Comment_View_List$render = F2(
	function (app, race) {
		var _p2 = app.riders;
		if (_p2.ctor === 'Just') {
			var _p3 = app.comments;
			if (_p3.ctor === 'Just') {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A3(_user$project$Comment_View_List$commentsTable, _p3._0, race, _p2._0),
						_1: {ctor: '[]'}
					});
			} else {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('No comments loaded.'),
						_1: {ctor: '[]'}
					});
			}
		} else {
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('No riders loaded.'),
					_1: {ctor: '[]'}
				});
		}
	});

var _user$project$Race_View_Details$getRiderById = F2(
	function (id, riders) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (rider) {
					return _elm_lang$core$Native_Utils.eq(rider.id, id);
				},
				riders));
	});
var _user$project$Race_View_Details$filterCommentsByRace = F2(
	function (comments, race) {
		return A2(
			_elm_lang$core$List$filter,
			function (comment) {
				return _elm_lang$core$Native_Utils.eq(comment.raceId, race.id);
			},
			comments);
	});
var _user$project$Race_View_Details$stravaSpan = function (maybeStrava) {
	var _p0 = maybeStrava;
	if (_p0.ctor === 'Just') {
		return A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$style(
					{
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'margin-left', _1: '5px'},
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$a,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$href(_p0._0),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$target('_blank'),
							_1: {ctor: '[]'}
						}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$img,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$src('https://d3nn82uaxijpm6.cloudfront.net/favicon-16x16.png'),
								_1: {ctor: '[]'}
							},
							{ctor: '[]'}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	} else {
		return A2(
			_elm_lang$html$Html$span,
			{ctor: '[]'},
			{ctor: '[]'});
	}
};
var _user$project$Race_View_Details$resultTd = F2(
	function (result, maybeStrava) {
		return A2(
			_elm_lang$html$Html$td,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$span,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(result),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: _user$project$Race_View_Details$stravaSpan(maybeStrava),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Race_View_Details$resultRow = F2(
	function (result, riders) {
		var maybeRider = _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (rider) {
					return _elm_lang$core$Native_Utils.eq(rider.id, result.riderId);
				},
				riders));
		var _p1 = maybeRider;
		if (_p1.ctor === 'Nothing') {
			return A2(
				_elm_lang$html$Html$tr,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$td,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('RiderId does not exist'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				});
		} else {
			var _p2 = _p1._0;
			return A2(
				_elm_lang$html$Html$tr,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$td,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$a,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$href(
										A2(
											_elm_lang$core$Basics_ops['++'],
											'#riders/',
											_elm_lang$core$Basics$toString(_p2.id))),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(_p2.name),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(_user$project$Race_View_Details$resultTd, result.result, result.strava),
						_1: {ctor: '[]'}
					}
				});
		}
	});
var _user$project$Race_View_Details$resultsByCategory = F3(
	function (category, results, riders) {
		var catResults = A2(
			_elm_lang$core$List$sortBy,
			function (_) {
				return _.result;
			},
			A2(
				_elm_lang$core$List$filter,
				function (result) {
					return _elm_lang$core$Native_Utils.eq(result.category, category);
				},
				results));
		var _p3 = _elm_lang$core$List$length(catResults);
		if (_p3 === 0) {
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{ctor: '[]'});
		} else {
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$h5,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(
								_elm_lang$core$Basics$toString(category)),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$table,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$thead,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$tr,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$th,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Rider'),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$th,
														{ctor: '[]'},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Result'),
															_1: {ctor: '[]'}
														}),
													_1: {ctor: '[]'}
												}
											}),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$tbody,
										{ctor: '[]'},
										A2(
											_elm_lang$core$List$map,
											function (result) {
												return A2(_user$project$Race_View_Details$resultRow, result, riders);
											},
											catResults)),
									_1: {ctor: '[]'}
								}
							}),
						_1: {ctor: '[]'}
					}
				});
		}
	});
var _user$project$Race_View_Details$resultsTable = F3(
	function (race, results, riders) {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			A2(
				_elm_lang$core$List$map,
				function (category) {
					return A3(_user$project$Race_View_Details$resultsByCategory, category, results, riders);
				},
				_user$project$Result_Model$categories));
	});
var _user$project$Race_View_Details$addCommentButton = F2(
	function (race, show) {
		return show ? A2(
			_elm_lang$html$Html$button,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('waves-effect waves-light btn'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						_user$project$App_Msg$NavigateTo(
							_user$project$App_Routing$CommentAdd(race.id))),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$name('action'),
						_1: {ctor: '[]'}
					}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text('Add Comment'),
				_1: {ctor: '[]'}
			}) : A2(
			_elm_lang$html$Html$span,
			{ctor: '[]'},
			{ctor: '[]'});
	});
var _user$project$Race_View_Details$addResultButton = F2(
	function (race, show) {
		return show ? A2(
			_elm_lang$html$Html$button,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('waves-effect waves-light btn'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						_user$project$App_Msg$NavigateTo(
							_user$project$App_Routing$ResultAdd(race.id))),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$name('action'),
						_1: {ctor: '[]'}
					}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text('Add result'),
				_1: {ctor: '[]'}
			}) : A2(
			_elm_lang$html$Html$span,
			{ctor: '[]'},
			{ctor: '[]'});
	});
var _user$project$Race_View_Details$dateFormat = function (date) {
	return A3(_rluiten$elm_date_extra$Date_Extra_Format$format, _rluiten$elm_date_extra$Date_Extra_Config_Config_nl_nl$config, '%d-%m-%Y', date);
};
var _user$project$Race_View_Details$info = function (race) {
	var dateString = function () {
		var _p4 = race.date;
		if (_p4.ctor === 'Just') {
			return _user$project$Race_View_Details$dateFormat(_p4._0);
		} else {
			return '1970-01-01';
		}
	}();
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('row'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('col s4'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$ul,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('collection'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$li,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('collection-item'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Name '),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$span,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('secondary-content'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(race.name),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$li,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('collection-item'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Date '),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$span,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('secondary-content'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(dateString),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$li,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('collection-item'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Category '),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$span,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class('secondary-content'),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text(
															_elm_lang$core$Basics$toString(race.category)),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$li,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('collection-item'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Points '),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$span,
														{
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$class('secondary-content'),
															_1: {ctor: '[]'}
														},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text(
																_elm_lang$core$Basics$toString(
																	_user$project$App_Helpers$getPointsByCategory(race.category))),
															_1: {ctor: '[]'}
														}),
													_1: {ctor: '[]'}
												}
											}),
										_1: {ctor: '[]'}
									}
								}
							}
						}),
					_1: {ctor: '[]'}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Race_View_Details$dateTimeFormat = function (date) {
	return A3(_rluiten$elm_date_extra$Date_Extra_Format$format, _rluiten$elm_date_extra$Date_Extra_Config_Config_nl_nl$config, '%d-%m-%Y %H:%M', date);
};
var _user$project$Race_View_Details$commentLi = F2(
	function (comment, maybeRider) {
		var _p5 = maybeRider;
		if (_p5.ctor === 'Nothing') {
			return A2(
				_elm_lang$html$Html$li,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Rider does not exist.'),
					_1: {ctor: '[]'}
				});
		} else {
			var _p7 = _p5._0;
			var updatedAt = function () {
				var _p6 = comment.updatedAt;
				if (_p6.ctor === 'Just') {
					return _user$project$Race_View_Details$dateTimeFormat(_p6._0);
				} else {
					return '';
				}
			}();
			return A2(
				_elm_lang$html$Html$li,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('collection-item avatar'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$i,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('material-icons circle red'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('perm_identity'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$span,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('title'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$a,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$href(
											A2(
												_elm_lang$core$Basics_ops['++'],
												'#riders/',
												_elm_lang$core$Basics$toString(_p7.id))),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(_p7.name),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$p,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$span,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text(updatedAt),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$br,
											{ctor: '[]'},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_evancz$elm_markdown$Markdown$toHtml,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('content'),
													_1: {ctor: '[]'}
												},
												comment.text),
											_1: {ctor: '[]'}
										}
									}
								}),
							_1: {ctor: '[]'}
						}
					}
				});
		}
	});
var _user$project$Race_View_Details$commentsUl = F3(
	function (comments, race, riders) {
		return A2(
			_elm_lang$html$Html$ul,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('collection'),
				_1: {ctor: '[]'}
			},
			A2(
				_elm_lang$core$List$map,
				function (comment) {
					return A2(
						_user$project$Race_View_Details$commentLi,
						comment,
						A2(_user$project$Race_View_Details$getRiderById, comment.riderId, riders));
				},
				A2(_user$project$Race_View_Details$filterCommentsByRace, comments, race)));
	});
var _user$project$Race_View_Details$render = F2(
	function (app, raceId) {
		var loggedIn = function () {
			var _p8 = app.account;
			if (_p8.ctor === 'Just') {
				return true;
			} else {
				return false;
			}
		}();
		var maybeRace = _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (race) {
					return _elm_lang$core$Native_Utils.eq(race.id, raceId);
				},
				A2(
					_elm_lang$core$Maybe$withDefault,
					{ctor: '[]'},
					app.races)));
		var _p9 = maybeRace;
		if (_p9.ctor === 'Nothing') {
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Race does not exist'),
					_1: {ctor: '[]'}
				});
		} else {
			var _p13 = _p9._0;
			var _p10 = app.riders;
			if (_p10.ctor === 'Just') {
				var _p12 = _p10._0;
				var _p11 = app.comments;
				if (_p11.ctor === 'Just') {
					var results = A2(
						_elm_lang$core$List$filter,
						function (result) {
							return _elm_lang$core$Native_Utils.eq(result.raceId, _p13.id);
						},
						app.results);
					return A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$h2,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(_p13.name),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: _user$project$Race_View_Details$info(_p13),
												_1: {ctor: '[]'}
											}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$h3,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Results'),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(_user$project$Race_View_Details$addResultButton, _p13, loggedIn),
													_1: {ctor: '[]'}
												}
											}),
										_1: {
											ctor: '::',
											_0: A3(_user$project$Race_View_Details$resultsTable, _p13, results, _p12),
											_1: {ctor: '[]'}
										}
									}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$h3,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Comments'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(_user$project$Race_View_Details$addCommentButton, _p13, loggedIn),
									_1: {
										ctor: '::',
										_0: A3(_user$project$Race_View_Details$commentsUl, _p11._0, _p13, _p12),
										_1: {ctor: '[]'}
									}
								}
							}
						});
				} else {
					return A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('No comments loaded.'),
							_1: {ctor: '[]'}
						});
				}
			} else {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('No riders loaded.'),
						_1: {ctor: '[]'}
					});
			}
		}
	});

var _user$project$Rider_View_List$countResultsByRiderId = F2(
	function (riderId, results) {
		return _elm_lang$core$List$length(
			A2(
				_elm_lang$core$List$filter,
				function (result) {
					return _elm_lang$core$Native_Utils.eq(result.riderId, riderId);
				},
				results));
	});
var _user$project$Rider_View_List$render = F3(
	function (riders, results, races) {
		return A2(
			_elm_lang$html$Html$table,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$thead,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$tr,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$th,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Name'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$th,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Licence'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$th,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Points'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$th,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Races'),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}
								}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$tbody,
						{ctor: '[]'},
						A2(
							_elm_lang$core$List$map,
							function (rider) {
								return A2(
									_elm_lang$html$Html$tr,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$td,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$a,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$href(
															A2(
																_elm_lang$core$Basics_ops['++'],
																'#riders/',
																_elm_lang$core$Basics$toString(rider.id))),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text(rider.name),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$td,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(
														_elm_lang$core$Basics$toString(rider.licence)),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$td,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text(
															_elm_lang$core$Basics$toString(
																A3(_user$project$App_Helpers$getPointsByRiderId, rider.id, results, races))),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$td,
														{ctor: '[]'},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text(
																_elm_lang$core$Basics$toString(
																	A2(_user$project$Rider_View_List$countResultsByRiderId, rider.id, results))),
															_1: {ctor: '[]'}
														}),
													_1: {ctor: '[]'}
												}
											}
										}
									});
							},
							riders)),
					_1: {ctor: '[]'}
				}
			});
	});

var _user$project$Rider_View_Details$info = F2(
	function (rider, points) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('row'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$ul,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('collection col s8 m6 l4'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$li,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('collection-item'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Name '),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$span,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('secondary-content'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text(rider.name),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$li,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('collection-item'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Licence '),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$span,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('secondary-content'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(
													_elm_lang$core$Basics$toString(rider.licence)),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$li,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('collection-item'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Points '),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$span,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('secondary-content'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(
														_elm_lang$core$Basics$toString(points)),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}),
								_1: {ctor: '[]'}
							}
						}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Rider_View_Details$dateFormat = function (date) {
	return A3(_rluiten$elm_date_extra$Date_Extra_Format$format, _rluiten$elm_date_extra$Date_Extra_Config_Config_nl_nl$config, '%d-%m-%Y', date);
};
var _user$project$Rider_View_Details$raceRow = F2(
	function (result, races) {
		var maybeRace = _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (race) {
					return _elm_lang$core$Native_Utils.eq(race.id, result.raceId);
				},
				races));
		var _p0 = maybeRace;
		if (_p0.ctor === 'Nothing') {
			return A2(
				_elm_lang$html$Html$tr,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$td,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('RaceId does not exist'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				});
		} else {
			var _p2 = _p0._0;
			var dateString = function () {
				var _p1 = _p2.date;
				if (_p1.ctor === 'Just') {
					return _user$project$Rider_View_Details$dateFormat(_p1._0);
				} else {
					return '1970-01-01';
				}
			}();
			return A2(
				_elm_lang$html$Html$tr,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$td,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(
								_elm_lang$core$Basics$toString(result.id)),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$td,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$a,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$href(
											A2(
												_elm_lang$core$Basics_ops['++'],
												'#races/',
												_elm_lang$core$Basics$toString(_p2.id))),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(_p2.name),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$td,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(dateString),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$td,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(
											_elm_lang$core$Basics$toString(
												A2(_user$project$App_Helpers$getPointsByResult, result, races))),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$td,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text(result.result),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				});
		}
	});
var _user$project$Rider_View_Details$resultsTable = F3(
	function (rider, results, races) {
		return A2(
			_elm_lang$html$Html$table,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$thead,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$tr,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$th,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('id'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$th,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Race'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$th,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Date'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$th,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Points'),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$th,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Result'),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$tbody,
						{ctor: '[]'},
						A2(
							_elm_lang$core$List$map,
							function (result) {
								return A2(_user$project$Rider_View_Details$raceRow, result, races);
							},
							results)),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Rider_View_Details$render = F2(
	function (app, riderId) {
		var _p3 = app.riders;
		if (_p3.ctor === 'Just') {
			var _p4 = app.races;
			if (_p4.ctor === 'Just') {
				var maybeRider = _elm_lang$core$List$head(
					A2(
						_elm_lang$core$List$filter,
						function (rider) {
							return _elm_lang$core$Native_Utils.eq(rider.id, riderId);
						},
						_p3._0));
				var _p5 = maybeRider;
				if (_p5.ctor === 'Nothing') {
					return A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$h2,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Rider'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$p,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Rider does not exist.'),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						});
				} else {
					var _p6 = _p5._0;
					var results = A2(
						_elm_lang$core$List$filter,
						function (result) {
							return _elm_lang$core$Native_Utils.eq(result.riderId, _p6.id);
						},
						app.results);
					var points = A2(_user$project$App_Helpers$getPointsByResults, results, _p4._0);
					return A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('col s12'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$h2,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(_p6.name),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(_user$project$Rider_View_Details$info, _p6, points),
								_1: {
									ctor: '::',
									_0: A3(
										_user$project$Rider_View_Details$resultsTable,
										_p6,
										results,
										A2(
											_elm_lang$core$Maybe$withDefault,
											{ctor: '[]'},
											app.races)),
									_1: {ctor: '[]'}
								}
							}
						});
				}
			} else {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('No races loaded.'),
						_1: {ctor: '[]'}
					});
			}
		} else {
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('No riders loaded.'),
					_1: {ctor: '[]'}
				});
		}
	});

var _user$project$Result_View_List$resultsTable = function (results) {
	return A2(
		_elm_lang$html$Html$table,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$thead,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$tr,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$th,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('id'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$th,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('raceId'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$th,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('riderId'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$th,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Result'),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}
							}
						}),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$tbody,
					{ctor: '[]'},
					A2(
						_elm_lang$core$List$map,
						function (result) {
							return A2(
								_elm_lang$html$Html$tr,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$td,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text(
												_elm_lang$core$Basics$toString(result.id)),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$td,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(
													_elm_lang$core$Basics$toString(result.raceId)),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$td,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(
														_elm_lang$core$Basics$toString(result.riderId)),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$td,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text(result.result),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}
									}
								});
						},
						results)),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Result_View_List$render = function (results) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _user$project$Result_View_List$resultsTable(results),
			_1: {ctor: '[]'}
		});
};

var _user$project$Result_View_Add$categoryButtonCheck = F4(
	function (categoryName, categoryText, category, isChecked) {
		return A2(
			_elm_lang$html$Html$p,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$input,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$checked(isChecked),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$name('category'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$type_('radio'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$id(categoryName),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Events$onClick(
											_user$project$App_Msg$ResultAddCategory(category)),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$label,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$for(categoryName),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(categoryText),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Result_View_Add$categoryButton = F3(
	function (categoryName, categoryText, category) {
		return A4(_user$project$Result_View_Add$categoryButtonCheck, categoryName, categoryText, category, false);
	});
var _user$project$Result_View_Add$categoryButtons = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A4(_user$project$Result_View_Add$categoryButtonCheck, 'amateurs', 'Amateurs', _user$project$Result_Model$Amateurs, true),
		_1: {
			ctor: '::',
			_0: A3(_user$project$Result_View_Add$categoryButton, 'basislidmaatschap', 'Basislidmaatschap', _user$project$Result_Model$Basislidmaatschap),
			_1: {
				ctor: '::',
				_0: A3(_user$project$Result_View_Add$categoryButton, 'cata', 'Cat A', _user$project$Result_Model$CatA),
				_1: {
					ctor: '::',
					_0: A3(_user$project$Result_View_Add$categoryButton, 'catb', 'Cat B', _user$project$Result_Model$CatB),
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Result_View_Add$resultExists = F3(
	function (rider, race, results) {
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(
				A2(
					_elm_lang$core$List$filter,
					function (result) {
						return _elm_lang$core$Native_Utils.eq(race.id, result.raceId) && _elm_lang$core$Native_Utils.eq(rider.id, result.riderId);
					},
					results)),
			1);
	});
var _user$project$Result_View_Add$render = F4(
	function (race, resultAdd, riders, results) {
		var filteredRiders = A2(
			_elm_lang$core$List$filter,
			function (rider) {
				return !A3(_user$project$Result_View_Add$resultExists, rider, race, results);
			},
			riders);
		var items = A2(
			_elm_lang$core$List$map,
			function (rider) {
				return {
					id: _elm_lang$core$Basics$toString(rider.id),
					label: rider.name,
					value: _elm_lang$core$Basics$toString(rider.id)
				};
			},
			filteredRiders);
		var chooser = function () {
			var _p0 = _elm_lang$core$List$head(items);
			if (_p0.ctor === 'Just') {
				var _p1 = A2(
					_elm_lang$core$Debug$log,
					'head.id',
					_elm_lang$core$Basics$toString(_p0._0.id));
				return resultAdd.chooser;
			} else {
				return resultAdd.chooser;
			}
		}();
		var submitDisabled = _elm_lang$core$String$isEmpty(resultAdd.result) || ((!_elm_lang$core$String$isEmpty(resultAdd.strava)) && (!A2(_elm_lang$core$String$contains, 'strava.com', resultAdd.strava)));
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$h2,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(
							A2(_elm_lang$core$Basics_ops['++'], 'Add result for ', race.name)),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('row'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('input-field col s6'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$input,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$id('result'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$type_('text'),
												_1: {
													ctor: '::',
													_0: _elm_lang$html$Html_Events$onInput(_user$project$App_Msg$ResultAddResult),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$autofocus(true),
														_1: {ctor: '[]'}
													}
												}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$label,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$for('result'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Result'),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('row'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('input-field col s6'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$map,
													_user$project$App_Msg$Chooser,
													_gdotdesign$elm_ui$Ui_Chooser$view(chooser)),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$label,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$for('rider'),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class('active'),
														_1: {ctor: '[]'}
													}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Rider'),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('row'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _user$project$Result_View_Add$categoryButtons,
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('row'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('input-field col s6'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$input,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$id('strava'),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$type_('text'),
															_1: {
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$value(resultAdd.strava),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$html$Html_Events$onInput(_user$project$App_Msg$ResultAddStrava),
																	_1: {ctor: '[]'}
																}
															}
														}
													},
													{ctor: '[]'}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$label,
														{
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$for('rider'),
															_1: {ctor: '[]'}
														},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Strava'),
															_1: {ctor: '[]'}
														}),
													_1: {ctor: '[]'}
												}
											}),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('row'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$button,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('waves-effect waves-light btn'),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$type_('submit'),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html_Events$onClick(_user$project$App_Msg$ResultAdd),
															_1: {
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$name('action'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$html$Html_Attributes$disabled(submitDisabled),
																	_1: {ctor: '[]'}
																}
															}
														}
													}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Add result'),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$i,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('material-icons right'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text('send'),
																_1: {ctor: '[]'}
															}),
														_1: {ctor: '[]'}
													}
												}),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			});
	});
var _user$project$Result_View_Add$riderNameExists = F2(
	function (name, riders) {
		return _elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$List$length(
				A2(
					_elm_lang$core$List$filter,
					function (rider) {
						return _elm_lang$core$Native_Utils.eq(rider.name, name);
					},
					riders)),
			0) > 0;
	});

var _user$project$Comment_View_Add$targetSelectedIndex = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'selectedIndex',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$int);
var _user$project$Comment_View_Add$onSelect = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, msg, _user$project$Comment_View_Add$targetSelectedIndex));
};
var _user$project$Comment_View_Add$selectRider = F2(
	function (selectedIndex, riders) {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{ctor: '[]'});
	});
var _user$project$Comment_View_Add$addButton = function (submitDisabled) {
	return A2(
		_elm_lang$html$Html$button,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('waves-effect waves-light btn'),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$type_('submit'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(_user$project$App_Msg$CommentAdd),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$name('action'),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$disabled(submitDisabled),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text('Add comment'),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$i,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('material-icons right'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('send'),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Comment_View_Add$render = F3(
	function (app, race, riders) {
		var _p0 = app.account;
		if (_p0.ctor === 'Nothing') {
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Who are you? Please login first.'),
					_1: {ctor: '[]'}
				});
		} else {
			var _p3 = _p0._0;
			var _p1 = app.page;
			if (_p1.ctor === 'CommentAdd') {
				var _p2 = _p1._0;
				var submitDisabled = _elm_lang$core$Native_Utils.eq(_p2.text, '');
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h2,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(
									A2(_elm_lang$core$Basics_ops['++'], 'Comment on ', race.name)),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$ul,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('collection'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$li,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('collection-item avatar'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$i,
														{
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$class('material-icons circle red'),
															_1: {ctor: '[]'}
														},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('perm_identity'),
															_1: {ctor: '[]'}
														}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$span,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('title'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: A2(
																	_elm_lang$html$Html$a,
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html_Attributes$href(
																			A2(
																				_elm_lang$core$Basics_ops['++'],
																				'#riders/',
																				_elm_lang$core$Basics$toString(_p3.id))),
																		_1: {ctor: '[]'}
																	},
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html$text(_p3.name),
																		_1: {ctor: '[]'}
																	}),
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$p,
																{ctor: '[]'},
																{
																	ctor: '::',
																	_0: A2(
																		_elm_lang$html$Html$textarea,
																		{
																			ctor: '::',
																			_0: _elm_lang$html$Html_Attributes$id('text'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$html$Html_Attributes$value(_p2.text),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$html$Html_Attributes$class(' materialize-textarea'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$html$Html_Events$onInput(_user$project$App_Msg$CommentAddSetText),
																						_1: {
																							ctor: '::',
																							_0: _elm_lang$html$Html_Attributes$autofocus(true),
																							_1: {ctor: '[]'}
																						}
																					}
																				}
																			}
																		},
																		{ctor: '[]'}),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_elm_lang$html$Html$label,
																			{
																				ctor: '::',
																				_0: _elm_lang$html$Html_Attributes$for('text'),
																				_1: {ctor: '[]'}
																			},
																			{
																				ctor: '::',
																				_0: _elm_lang$html$Html$text('Comment'),
																				_1: {ctor: '[]'}
																			}),
																		_1: {ctor: '[]'}
																	}
																}),
															_1: {ctor: '[]'}
														}
													}
												}),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: _user$project$Comment_View_Add$addButton(submitDisabled),
								_1: {ctor: '[]'}
							}
						}
					});
			} else {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('commentAdd nothing'),
						_1: {ctor: '[]'}
					});
			}
		}
	});

var _user$project$App_View$getRace = F2(
	function (raceId, races) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (race) {
					return _elm_lang$core$Native_Utils.eq(race.id, raceId);
				},
				races));
	});
var _user$project$App_View$viewMessage = function (reponse) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(reponse),
			_1: {ctor: '[]'}
		});
};
var _user$project$App_View$userLi = function (app) {
	var _p0 = app.account;
	if (_p0.ctor === 'Just') {
		var _p2 = _p0._0;
		var content = function () {
			var _p1 = _p2.licence;
			if (_p1.ctor === 'Just') {
				return {
					ctor: '::',
					_0: _elm_lang$html$Html$text(_p2.name),
					_1: {ctor: '[]'}
				};
			} else {
				return {
					ctor: '::',
					_0: _elm_lang$html$Html$text(_p2.name),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$span,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('new badge'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('1'),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				};
			}
		}();
		return {
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$li,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$a,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$href('#account'),
							_1: {ctor: '[]'}
						},
						content),
					_1: {ctor: '[]'}
				}),
			_1: {ctor: '[]'}
		};
	} else {
		return {
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$li,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$a,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$href('#account/login'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Login'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$li,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$a,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$href('#account/signup'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Signup'),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		};
	}
};
var _user$project$App_View$header = function (app) {
	return A2(
		_elm_lang$html$Html$nav,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('nav-wrapper blue darken-4'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$a,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('brand-logo left'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$href('#races'),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('WRS'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$ul,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$id('nav-mobile'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('right'),
									_1: {ctor: '[]'}
								}
							},
							_elm_lang$core$List$concat(
								{
									ctor: '::',
									_0: _user$project$App_View$userLi(app),
									_1: {
										ctor: '::',
										_0: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$li,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$a,
														{
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$href('#races'),
															_1: {ctor: '[]'}
														},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Races'),
															_1: {ctor: '[]'}
														}),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										},
										_1: {
											ctor: '::',
											_0: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$li,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$a,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$href('#riders'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text('Riders'),
																_1: {ctor: '[]'}
															}),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											},
											_1: {ctor: '[]'}
										}
									}
								})),
						_1: {ctor: '[]'}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$App_View$viewPage = function (app) {
	var _p3 = app.route;
	switch (_p3.ctor) {
		case 'Home':
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$h2,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Home'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				});
		case 'Riders':
			var _p4 = app.riders;
			if (_p4.ctor === 'Just') {
				var _p5 = app.races;
				if (_p5.ctor === 'Just') {
					return A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$h2,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Riders'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A3(_user$project$Rider_View_List$render, _p4._0, app.results, _p5._0),
								_1: {ctor: '[]'}
							}
						});
				} else {
					return A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('No races loaded.'),
							_1: {ctor: '[]'}
						});
				}
			} else {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('No riders loaded.'),
						_1: {ctor: '[]'}
					});
			}
		case 'RiderDetails':
			return A2(_user$project$Rider_View_Details$render, app, _p3._0);
		case 'Races':
			return A3(
				_user$project$Race_View_List$render,
				!_elm_lang$core$Native_Utils.eq(app.account, _elm_lang$core$Maybe$Nothing),
				A2(
					_elm_lang$core$Maybe$withDefault,
					{ctor: '[]'},
					app.races),
				app.results);
		case 'RaceDetails':
			return A2(_user$project$Race_View_Details$render, app, _p3._0);
		case 'RaceAdd':
			var _p6 = app.account;
			if (_p6.ctor === 'Just') {
				var _p7 = app.page;
				if (_p7.ctor === 'RaceAdd') {
					return A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _user$project$Race_View_Add$render(_p7._0),
							_1: {ctor: '[]'}
						});
				} else {
					return A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Page not RaceAdd'),
							_1: {ctor: '[]'}
						});
				}
			} else {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Please log in.'),
						_1: {ctor: '[]'}
					});
			}
		case 'Results':
			return _user$project$Result_View_List$render(app.results);
		case 'ResultAdd':
			var _p8 = app.account;
			if (_p8.ctor === 'Just') {
				var _p9 = app.page;
				if (_p9.ctor === 'ResultAdd') {
					var maybeRace = A2(
						_user$project$App_View$getRace,
						_p3._0,
						A2(
							_elm_lang$core$Maybe$withDefault,
							{ctor: '[]'},
							app.races));
					var _p10 = maybeRace;
					if (_p10.ctor === 'Nothing') {
						return A2(
							_elm_lang$html$Html$div,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Race does not exist. Adding result not possible.'),
								_1: {ctor: '[]'}
							});
					} else {
						var _p11 = app.riders;
						if (_p11.ctor === 'Just') {
							return A2(
								_elm_lang$html$Html$div,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: A4(_user$project$Result_View_Add$render, _p10._0, _p9._0, _p11._0, app.results),
									_1: {ctor: '[]'}
								});
						} else {
							return A2(
								_elm_lang$html$Html$div,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('No riders loaded.'),
									_1: {ctor: '[]'}
								});
						}
					}
				} else {
					return A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('No resultAdd.'),
							_1: {ctor: '[]'}
						});
				}
			} else {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Please log in.'),
						_1: {ctor: '[]'}
					});
			}
		case 'CommentAdd':
			var maybeRace = A2(
				_user$project$App_View$getRace,
				_p3._0,
				A2(
					_elm_lang$core$Maybe$withDefault,
					{ctor: '[]'},
					app.races));
			var _p12 = maybeRace;
			if (_p12.ctor === 'Nothing') {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Race does not exist. Adding comment not possible.'),
						_1: {ctor: '[]'}
					});
			} else {
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A3(
							_user$project$Comment_View_Add$render,
							app,
							_p12._0,
							A2(
								_elm_lang$core$Maybe$withDefault,
								{ctor: '[]'},
								app.riders)),
						_1: {ctor: '[]'}
					});
			}
		case 'AccountLogin':
			return _user$project$Account_View$login(app);
		case 'AccountLoginName':
			return _user$project$Account_View$login(app);
		case 'AccountLogout':
			return _user$project$Account_View$logout(app);
		case 'Account':
			return _user$project$Account_View$render(app);
		default:
			return _user$project$Account_View$signup(app);
	}
};
var _user$project$App_View$mainView = function (app) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('container'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _user$project$App_View$viewPage(app),
			_1: {ctor: '[]'}
		});
};
var _user$project$App_View$render = function (app) {
	var _p13 = app.connected;
	if (_p13 === true) {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: _user$project$App_View$header(app),
				_1: {
					ctor: '::',
					_0: _user$project$App_View$mainView(app),
					_1: {ctor: '[]'}
				}
			});
	} else {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text('Disconnected'),
				_1: {ctor: '[]'}
			});
	}
};

var _user$project$Main$subscriptions = function (app) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$listen, app.phxSocket, _user$project$App_Msg$PhoenixMsg),
			_1: {ctor: '[]'}
		});
};
var _user$project$Main$init = F2(
	function (flags, location) {
		var _p0 = _user$project$App_Model$initial(flags);
		var initialApp = _p0._0;
		var initialCmd = _p0._1;
		var route = _user$project$App_Routing$routeParser(location);
		var _p1 = A2(_user$project$App_UrlUpdate$urlUpdate, route, initialApp);
		var app = _p1._0;
		var cmd = _p1._1;
		return {
			ctor: '_Tuple2',
			_0: app,
			_1: _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: cmd,
					_1: {
						ctor: '::',
						_0: initialCmd,
						_1: {ctor: '[]'}
					}
				})
		};
	});
var _user$project$Main$parser = function (location) {
	return _user$project$App_Msg$UrlUpdate(
		_user$project$App_Routing$routeParser(location));
};
var _user$project$Main$main = A2(
	_elm_lang$navigation$Navigation$programWithFlags,
	_user$project$Main$parser,
	{init: _user$project$Main$init, update: _user$project$App_Update$update, subscriptions: _user$project$Main$subscriptions, view: _user$project$App_View$render})(
	A2(
		_elm_lang$core$Json_Decode$andThen,
		function (wsUrl) {
			return _elm_lang$core$Json_Decode$succeed(
				{wsUrl: wsUrl});
		},
		A2(_elm_lang$core$Json_Decode$field, 'wsUrl', _elm_lang$core$Json_Decode$string)));

var Elm = {};
Elm['Main'] = Elm['Main'] || {};
if (typeof _user$project$Main$main !== 'undefined') {
    _user$project$Main$main(Elm['Main'], 'Main', undefined);
}

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);

