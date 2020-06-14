
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j];
                    if (attributes[attribute.name]) {
                        j++;
                    }
                    else {
                        node.removeAttribute(attribute.name);
                    }
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules/svelte-typewriter/Typewriter.svelte generated by Svelte v3.23.0 */

    const { Error: Error_1 } = globals;
    const file = "node_modules/svelte-typewriter/Typewriter.svelte";

    function create_fragment(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();

    			set_style(div, "--cursor-color", typeof /*cursor*/ ctx[0] === "string"
    			? /*cursor*/ ctx[0]
    			: "black");

    			attr_dev(div, "class", "svelte-1z0z1xp");
    			toggle_class(div, "cursor", /*cursor*/ ctx[0]);
    			add_location(div, file, 114, 0, 4147);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[18](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*cursor*/ 1) {
    				set_style(div, "--cursor-color", typeof /*cursor*/ ctx[0] === "string"
    				? /*cursor*/ ctx[0]
    				: "black");
    			}

    			if (dirty & /*cursor*/ 1) {
    				toggle_class(div, "cursor", /*cursor*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[18](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { interval = 30 } = $$props;
    	let { cascade = false } = $$props;
    	let { loop = false } = $$props;
    	let { cursor = true } = $$props;
    	let node;
    	let elements = [];
    	const dispatch = createEventDispatcher();
    	if (cascade && loop) throw new Error("`cascade` mode should not be used with `loop`!");
    	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    	const rng = (min, max) => Math.floor(Math.random() * (max - min) + min);
    	const hasSingleTextNode = el => el.childNodes.length === 1 && el.childNodes[0].nodeType === 3;

    	const typingInterval = async () => Array.isArray(interval)
    	? await sleep(interval[rng(0, interval.length)])
    	: await sleep(interval);

    	const getElements = parentElement => {
    		const treeWalker = document.createTreeWalker(parentElement, NodeFilter.SHOW_ELEMENT);
    		let currentNode = treeWalker.nextNode();

    		while (currentNode) {
    			const text = currentNode.textContent.split("");
    			hasSingleTextNode(currentNode) && elements.push(!loop ? { currentNode, text } : text);
    			currentNode = treeWalker.nextNode();
    		}
    	};

    	const typewriterEffect = async ({ currentNode, text }, { loopAnimation } = { loopAnimation: false }) => {
    		currentNode.textContent = "";
    		currentNode.classList.add("typing");

    		for (const letter of text) {
    			currentNode.textContent += letter;
    			const fullyWritten = loopAnimation && currentNode.textContent === text.join("");

    			if (fullyWritten) {
    				typeof loop === "number"
    				? await sleep(loop)
    				: await sleep(1500);

    				while (currentNode.textContent !== "") {
    					currentNode.textContent = currentNode.textContent.slice(0, -1);
    					await typingInterval();
    				}

    				return;
    			}

    			await typingInterval();
    		}

    		if (currentNode.nextSibling !== null || !cascade) currentNode.classList.length == 1
    		? currentNode.removeAttribute("class")
    		: currentNode.classList.remove("typing");
    	};

    	const cascadeMode = async () => {
    		elements.forEach(({ currentNode }) => currentNode.textContent = "");
    		for (const element of elements) await typewriterEffect(element);
    		dispatch("done");
    	};

    	const loopMode = async () => {
    		const loopParagraphTag = node.firstChild.tagName.toLowerCase();
    		const loopParagraph = document.createElement(loopParagraphTag);
    		node.childNodes.forEach(el => el.remove());
    		node.appendChild(loopParagraph);

    		while (loop) {
    			for (const text of elements) {
    				loopParagraph.textContent = text.join("");
    				await typewriterEffect({ currentNode: loopParagraph, text }, { loopAnimation: true });
    			}

    			dispatch("done");
    		}
    	};

    	const defaultMode = async () => {
    		await new Promise(resolve => {
    				elements.forEach(async (element, i) => {
    					await typewriterEffect(element);
    					i + 1 === elements.length && resolve();
    				});
    			});

    		dispatch("done");
    	};

    	onMount(async () => {
    		if (hasSingleTextNode(node)) throw new Error("<Typewriter /> must have at least one element");
    		getElements(node);

    		cascade
    		? cascadeMode()
    		: loop ? loopMode() : defaultMode();
    	});

    	onDestroy(() => $$invalidate(2, loop = false));
    	const writable_props = ["interval", "cascade", "loop", "cursor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Typewriter> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Typewriter", $$slots, ['default']);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, node = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("interval" in $$props) $$invalidate(3, interval = $$props.interval);
    		if ("cascade" in $$props) $$invalidate(4, cascade = $$props.cascade);
    		if ("loop" in $$props) $$invalidate(2, loop = $$props.loop);
    		if ("cursor" in $$props) $$invalidate(0, cursor = $$props.cursor);
    		if ("$$scope" in $$props) $$invalidate(16, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		onDestroy,
    		interval,
    		cascade,
    		loop,
    		cursor,
    		node,
    		elements,
    		dispatch,
    		sleep,
    		rng,
    		hasSingleTextNode,
    		typingInterval,
    		getElements,
    		typewriterEffect,
    		cascadeMode,
    		loopMode,
    		defaultMode
    	});

    	$$self.$inject_state = $$props => {
    		if ("interval" in $$props) $$invalidate(3, interval = $$props.interval);
    		if ("cascade" in $$props) $$invalidate(4, cascade = $$props.cascade);
    		if ("loop" in $$props) $$invalidate(2, loop = $$props.loop);
    		if ("cursor" in $$props) $$invalidate(0, cursor = $$props.cursor);
    		if ("node" in $$props) $$invalidate(1, node = $$props.node);
    		if ("elements" in $$props) elements = $$props.elements;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		cursor,
    		node,
    		loop,
    		interval,
    		cascade,
    		elements,
    		dispatch,
    		sleep,
    		rng,
    		hasSingleTextNode,
    		typingInterval,
    		getElements,
    		typewriterEffect,
    		cascadeMode,
    		loopMode,
    		defaultMode,
    		$$scope,
    		$$slots,
    		div_binding
    	];
    }

    class Typewriter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			interval: 3,
    			cascade: 4,
    			loop: 2,
    			cursor: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Typewriter",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get interval() {
    		throw new Error_1("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set interval(value) {
    		throw new Error_1("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cascade() {
    		throw new Error_1("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cascade(value) {
    		throw new Error_1("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loop() {
    		throw new Error_1("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loop(value) {
    		throw new Error_1("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cursor() {
    		throw new Error_1("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cursor(value) {
    		throw new Error_1("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var vivus = createCommonjsModule(function (module, exports) {
    /**
     * vivus - JavaScript library to make drawing animation on SVG
     * @version v0.4.5
     * @link https://github.com/maxwellito/vivus
     * @license MIT
     */

    (function () {

    /**
     * Pathformer
     * Beta version
     *
     * Take any SVG version 1.1 and transform
     * child elements to 'path' elements
     *
     * This code is purely forked from
     * https://github.com/Waest/SVGPathConverter
     */

    /**
     * Class constructor
     *
     * @param {DOM|String} element Dom element of the SVG or id of it
     */
    function Pathformer(element) {
      // Test params
      if (typeof element === 'undefined') {
        throw new Error('Pathformer [constructor]: "element" parameter is required');
      }

      // Set the element
      if (element.constructor === String) {
        element = document.getElementById(element);
        if (!element) {
          throw new Error('Pathformer [constructor]: "element" parameter is not related to an existing ID');
        }
      }
      if (element instanceof window.SVGElement || 
          element instanceof window.SVGGElement ||
          /^svg$/i.test(element.nodeName)) {
        this.el = element;
      } else {
        throw new Error('Pathformer [constructor]: "element" parameter must be a string or a SVGelement');
      }

      // Start
      this.scan(element);
    }

    /**
     * List of tags which can be transformed
     * to path elements
     *
     * @type {Array}
     */
    Pathformer.prototype.TYPES = ['line', 'ellipse', 'circle', 'polygon', 'polyline', 'rect'];

    /**
     * List of attribute names which contain
     * data. This array list them to check if
     * they contain bad values, like percentage.
     *
     * @type {Array}
     */
    Pathformer.prototype.ATTR_WATCH = ['cx', 'cy', 'points', 'r', 'rx', 'ry', 'x', 'x1', 'x2', 'y', 'y1', 'y2'];

    /**
     * Finds the elements compatible for transform
     * and apply the liked method
     *
     * @param  {object} options Object from the constructor
     */
    Pathformer.prototype.scan = function (svg) {
      var fn, element, pathData, pathDom,
          elements = svg.querySelectorAll(this.TYPES.join(','));

      for (var i = 0; i < elements.length; i++) {
        element = elements[i];
        fn = this[element.tagName.toLowerCase() + 'ToPath'];
        pathData = fn(this.parseAttr(element.attributes));
        pathDom = this.pathMaker(element, pathData);
        element.parentNode.replaceChild(pathDom, element);
      }
    };


    /**
     * Read `line` element to extract and transform
     * data, to make it ready for a `path` object.
     *
     * @param  {DOMelement} element Line element to transform
     * @return {object}             Data for a `path` element
     */
    Pathformer.prototype.lineToPath = function (element) {
      var newElement = {},
          x1 = element.x1 || 0,
          y1 = element.y1 || 0,
          x2 = element.x2 || 0,
          y2 = element.y2 || 0;

      newElement.d = 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2;
      return newElement;
    };

    /**
     * Read `rect` element to extract and transform
     * data, to make it ready for a `path` object.
     * The radius-border is not taken in charge yet.
     * (your help is more than welcomed)
     *
     * @param  {DOMelement} element Rect element to transform
     * @return {object}             Data for a `path` element
     */
    Pathformer.prototype.rectToPath = function (element) {
      var newElement = {},
          x      = parseFloat(element.x)      || 0,
          y      = parseFloat(element.y)      || 0,
          width  = parseFloat(element.width)  || 0,
          height = parseFloat(element.height) || 0;

      if (element.rx || element.ry) {
        var rx = parseInt(element.rx, 10) || -1,
            ry = parseInt(element.ry, 10) || -1;
        rx = Math.min(Math.max(rx < 0 ? ry : rx, 0), width/2);
        ry = Math.min(Math.max(ry < 0 ? rx : ry, 0), height/2);

        newElement.d = 'M ' + (x + rx) + ',' + y + ' ' +
                       'L ' + (x + width - rx) + ',' + y + ' ' +
                       'A ' + rx + ',' + ry + ',0,0,1,' + (x + width) + ',' + (y + ry) + ' ' +
                       'L ' + (x + width) + ',' + (y + height - ry) + ' ' +
                       'A ' + rx + ',' + ry + ',0,0,1,' + (x + width - rx) + ',' + (y + height) + ' ' +
                       'L ' + (x + rx) + ',' + (y + height) + ' ' +
                       'A ' + rx + ',' + ry + ',0,0,1,' + x + ',' + (y + height - ry) + ' ' +
                       'L ' + x + ',' + (y + ry) + ' ' +
                       'A ' + rx + ',' + ry + ',0,0,1,' + (x + rx) + ',' + y;
      }
      else {
        newElement.d = 'M' + x + ' ' + y + ' ' +
                       'L' + (x + width) + ' ' + y + ' ' +
                       'L' + (x + width) + ' ' + (y + height) + ' ' +
                       'L' + x + ' ' + (y + height) + ' Z';
      }
      return newElement;
    };

    /**
     * Read `polyline` element to extract and transform
     * data, to make it ready for a `path` object.
     *
     * @param  {DOMelement} element Polyline element to transform
     * @return {object}             Data for a `path` element
     */
    Pathformer.prototype.polylineToPath = function (element) {
      var newElement = {},
          points = element.points.trim().split(' '),
          i, path;

      // Reformatting if points are defined without commas
      if (element.points.indexOf(',') === -1) {
        var formattedPoints = [];
        for (i = 0; i < points.length; i+=2) {
          formattedPoints.push(points[i] + ',' + points[i+1]);
        }
        points = formattedPoints;
      }

      // Generate the path.d value
      path = 'M' + points[0];
      for(i = 1; i < points.length; i++) {
        if (points[i].indexOf(',') !== -1) {
          path += 'L' + points[i];
        }
      }
      newElement.d = path;
      return newElement;
    };

    /**
     * Read `polygon` element to extract and transform
     * data, to make it ready for a `path` object.
     * This method rely on polylineToPath, because the
     * logic is similar. The path created is just closed,
     * so it needs an 'Z' at the end.
     *
     * @param  {DOMelement} element Polygon element to transform
     * @return {object}             Data for a `path` element
     */
    Pathformer.prototype.polygonToPath = function (element) {
      var newElement = Pathformer.prototype.polylineToPath(element);

      newElement.d += 'Z';
      return newElement;
    };

    /**
     * Read `ellipse` element to extract and transform
     * data, to make it ready for a `path` object.
     *
     * @param  {DOMelement} element ellipse element to transform
     * @return {object}             Data for a `path` element
     */
    Pathformer.prototype.ellipseToPath = function (element) {
      var newElement = {},
          rx = parseFloat(element.rx) || 0,
          ry = parseFloat(element.ry) || 0,
          cx = parseFloat(element.cx) || 0,
          cy = parseFloat(element.cy) || 0,
          startX = cx - rx,
          startY = cy,
          endX = parseFloat(cx) + parseFloat(rx),
          endY = cy;

      newElement.d = 'M' + startX + ',' + startY +
                     'A' + rx + ',' + ry + ' 0,1,1 ' + endX + ',' + endY +
                     'A' + rx + ',' + ry + ' 0,1,1 ' + startX + ',' + endY;
      return newElement;
    };

    /**
     * Read `circle` element to extract and transform
     * data, to make it ready for a `path` object.
     *
     * @param  {DOMelement} element Circle element to transform
     * @return {object}             Data for a `path` element
     */
    Pathformer.prototype.circleToPath = function (element) {
      var newElement = {},
          r  = parseFloat(element.r)  || 0,
          cx = parseFloat(element.cx) || 0,
          cy = parseFloat(element.cy) || 0,
          startX = cx - r,
          startY = cy,
          endX = parseFloat(cx) + parseFloat(r),
          endY = cy;
          
      newElement.d =  'M' + startX + ',' + startY +
                      'A' + r + ',' + r + ' 0,1,1 ' + endX + ',' + endY +
                      'A' + r + ',' + r + ' 0,1,1 ' + startX + ',' + endY;
      return newElement;
    };

    /**
     * Create `path` elements form original element
     * and prepared objects
     *
     * @param  {DOMelement} element  Original element to transform
     * @param  {object} pathData     Path data (from `toPath` methods)
     * @return {DOMelement}          Path element
     */
    Pathformer.prototype.pathMaker = function (element, pathData) {
      var i, attr, pathTag = document.createElementNS('http://www.w3.org/2000/svg','path');
      for(i = 0; i < element.attributes.length; i++) {
        attr = element.attributes[i];
        if (this.ATTR_WATCH.indexOf(attr.name) === -1) {
          pathTag.setAttribute(attr.name, attr.value);
        }
      }
      for(i in pathData) {
        pathTag.setAttribute(i, pathData[i]);
      }
      return pathTag;
    };

    /**
     * Parse attributes of a DOM element to
     * get an object of attribute => value
     *
     * @param  {NamedNodeMap} attributes Attributes object from DOM element to parse
     * @return {object}                  Object of attributes
     */
    Pathformer.prototype.parseAttr = function (element) {
      var attr, output = {};
      for (var i = 0; i < element.length; i++) {
        attr = element[i];
        // Check if no data attribute contains '%', or the transformation is impossible
        if (this.ATTR_WATCH.indexOf(attr.name) !== -1 && attr.value.indexOf('%') !== -1) {
          throw new Error('Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into \'path\' tags. Please use \'viewBox\'.');
        }
        output[attr.name] = attr.value;
      }
      return output;
    };

    var setupEnv, requestAnimFrame, cancelAnimFrame, parsePositiveInt;

    /**
     * Vivus
     * Beta version
     *
     * Take any SVG and make the animation
     * to give give the impression of live drawing
     *
     * This in more than just inspired from codrops
     * At that point, it's a pure fork.
     */

    /**
     * Class constructor
     * option structure
     *   type: 'delayed'|'sync'|'oneByOne'|'script' (to know if the items must be drawn synchronously or not, default: delayed)
     *   duration: <int> (in frames)
     *   start: 'inViewport'|'manual'|'autostart' (start automatically the animation, default: inViewport)
     *   delay: <int> (delay between the drawing of first and last path)
     *   dashGap <integer> whitespace extra margin between dashes
     *   pathTimingFunction <function> timing animation function for each path element of the SVG
     *   animTimingFunction <function> timing animation function for the complete SVG
     *   forceRender <boolean> force the browser to re-render all updated path items
     *   selfDestroy <boolean> removes all extra styling on the SVG, and leaves it as original
     *
     * The attribute 'type' is by default on 'delayed'.
     *  - 'delayed'
     *    all paths are draw at the same time but with a
     *    little delay between them before start
     *  - 'sync'
     *    all path are start and finish at the same time
     *  - 'oneByOne'
     *    only one path is draw at the time
     *    the end of the first one will trigger the draw
     *    of the next one
     *
     * All these values can be overwritten individually
     * for each path item in the SVG
     * The value of frames will always take the advantage of
     * the duration value.
     * If you fail somewhere, an error will be thrown.
     * Good luck.
     *
     * @constructor
     * @this {Vivus}
     * @param {DOM|String}   element  Dom element of the SVG or id of it
     * @param {Object}       options  Options about the animation
     * @param {Function}     callback Callback for the end of the animation
     */
    function Vivus(element, options, callback) {
      setupEnv();

      // Setup
      this.isReady = false;
      this.setElement(element, options);
      this.setOptions(options);
      this.setCallback(callback);

      if (this.isReady) {
        this.init();
      }
    }

    /**
     * Timing functions
     **************************************
     *
     * Default functions to help developers.
     * It always take a number as parameter (between 0 to 1) then
     * return a number (between 0 and 1)
     */
    Vivus.LINEAR = function(x) {
      return x;
    };
    Vivus.EASE = function(x) {
      return -Math.cos(x * Math.PI) / 2 + 0.5;
    };
    Vivus.EASE_OUT = function(x) {
      return 1 - Math.pow(1 - x, 3);
    };
    Vivus.EASE_IN = function(x) {
      return Math.pow(x, 3);
    };
    Vivus.EASE_OUT_BOUNCE = function(x) {
      var base = -Math.cos(x * (0.5 * Math.PI)) + 1,
        rate = Math.pow(base, 1.5),
        rateR = Math.pow(1 - x, 2),
        progress = -Math.abs(Math.cos(rate * (2.5 * Math.PI))) + 1;
      return 1 - rateR + progress * rateR;
    };

    /**
     * Setters
     **************************************
     */

    /**
     * Check and set the element in the instance
     * The method will not return anything, but will throw an
     * error if the parameter is invalid
     *
     * @param {DOM|String}   element  SVG Dom element or id of it
     */
    Vivus.prototype.setElement = function(element, options) {
      var onLoad, self;

      // Basic check
      if (typeof element === 'undefined') {
        throw new Error('Vivus [constructor]: "element" parameter is required');
      }

      // Set the element
      if (element.constructor === String) {
        element = document.getElementById(element);
        if (!element) {
          throw new Error(
            'Vivus [constructor]: "element" parameter is not related to an existing ID'
          );
        }
      }
      this.parentEl = element;

      // Load the SVG with XMLHttpRequest and extract the SVG
      if (options && options.file) {
        self = this;
        onLoad = function() {
          var domSandbox = document.createElement('div');
          domSandbox.innerHTML = this.responseText;

          var svgTag = domSandbox.querySelector('svg');
          if (!svgTag) {
            throw new Error(
              'Vivus [load]: Cannot find the SVG in the loaded file : ' +
                options.file
            );
          }

          self.el = svgTag;
          self.el.setAttribute('width', '100%');
          self.el.setAttribute('height', '100%');
          self.parentEl.appendChild(self.el);
          self.isReady = true;
          self.init();
          self = null;
        };

        var oReq = new window.XMLHttpRequest();
        oReq.addEventListener('load', onLoad);
        oReq.open('GET', options.file);
        oReq.send();
        return;
      }

      switch (element.constructor) {
        case window.SVGSVGElement:
        case window.SVGElement:
        case window.SVGGElement:
          this.el = element;
          this.isReady = true;
          break;

        case window.HTMLObjectElement:
          self = this;
          onLoad = function(e) {
            if (self.isReady) {
              return;
            }
            self.el =
              element.contentDocument &&
              element.contentDocument.querySelector('svg');
            if (!self.el && e) {
              throw new Error(
                'Vivus [constructor]: object loaded does not contain any SVG'
              );
            } else if (self.el) {
              if (element.getAttribute('built-by-vivus')) {
                self.parentEl.insertBefore(self.el, element);
                self.parentEl.removeChild(element);
                self.el.setAttribute('width', '100%');
                self.el.setAttribute('height', '100%');
              }
              self.isReady = true;
              self.init();
              self = null;
            }
          };

          if (!onLoad()) {
            element.addEventListener('load', onLoad);
          }
          break;

        default:
          throw new Error(
            'Vivus [constructor]: "element" parameter is not valid (or miss the "file" attribute)'
          );
      }
    };

    /**
     * Set up user option to the instance
     * The method will not return anything, but will throw an
     * error if the parameter is invalid
     *
     * @param  {object} options Object from the constructor
     */
    Vivus.prototype.setOptions = function(options) {
      var allowedTypes = [
        'delayed',
        'sync',
        'async',
        'nsync',
        'oneByOne',
        'scenario',
        'scenario-sync'
      ];
      var allowedStarts = ['inViewport', 'manual', 'autostart'];

      // Basic check
      if (options !== undefined && options.constructor !== Object) {
        throw new Error(
          'Vivus [constructor]: "options" parameter must be an object'
        );
      } else {
        options = options || {};
      }

      // Set the animation type
      if (options.type && allowedTypes.indexOf(options.type) === -1) {
        throw new Error(
          'Vivus [constructor]: ' +
            options.type +
            ' is not an existing animation `type`'
        );
      } else {
        this.type = options.type || allowedTypes[0];
      }

      // Set the start type
      if (options.start && allowedStarts.indexOf(options.start) === -1) {
        throw new Error(
          'Vivus [constructor]: ' +
            options.start +
            ' is not an existing `start` option'
        );
      } else {
        this.start = options.start || allowedStarts[0];
      }

      this.isIE =
        window.navigator.userAgent.indexOf('MSIE') !== -1 ||
        window.navigator.userAgent.indexOf('Trident/') !== -1 ||
        window.navigator.userAgent.indexOf('Edge/') !== -1;
      this.duration = parsePositiveInt(options.duration, 120);
      this.delay = parsePositiveInt(options.delay, null);
      this.dashGap = parsePositiveInt(options.dashGap, 1);
      this.forceRender = options.hasOwnProperty('forceRender')
        ? !!options.forceRender
        : this.isIE;
      this.reverseStack = !!options.reverseStack;
      this.selfDestroy = !!options.selfDestroy;
      this.onReady = options.onReady;
      this.map = [];
      this.frameLength = this.currentFrame = this.delayUnit = this.speed = this.handle = null;

      this.ignoreInvisible = options.hasOwnProperty('ignoreInvisible')
        ? !!options.ignoreInvisible
        : false;

      this.animTimingFunction = options.animTimingFunction || Vivus.LINEAR;
      this.pathTimingFunction = options.pathTimingFunction || Vivus.LINEAR;

      if (this.delay >= this.duration) {
        throw new Error('Vivus [constructor]: delay must be shorter than duration');
      }
    };

    /**
     * Set up callback to the instance
     * The method will not return enything, but will throw an
     * error if the parameter is invalid
     *
     * @param  {Function} callback Callback for the animation end
     */
    Vivus.prototype.setCallback = function(callback) {
      // Basic check
      if (!!callback && callback.constructor !== Function) {
        throw new Error(
          'Vivus [constructor]: "callback" parameter must be a function'
        );
      }
      this.callback = callback || function() {};
    };

    /**
     * Core
     **************************************
     */

    /**
     * Map the svg, path by path.
     * The method return nothing, it just fill the
     * `map` array. Each item in this array represent
     * a path element from the SVG, with informations for
     * the animation.
     *
     * ```
     * [
     *   {
     *     el: <DOMobj> the path element
     *     length: <number> length of the path line
     *     startAt: <number> time start of the path animation (in frames)
     *     duration: <number> path animation duration (in frames)
     *   },
     *   ...
     * ]
     * ```
     *
     */
    Vivus.prototype.mapping = function() {
      var i, paths, path, pAttrs, pathObj, totalLength, lengthMeter, timePoint;
      timePoint = totalLength = lengthMeter = 0;
      paths = this.el.querySelectorAll('path');

      for (i = 0; i < paths.length; i++) {
        path = paths[i];
        if (this.isInvisible(path)) {
          continue;
        }
        pathObj = {
          el: path,
          length: Math.ceil(path.getTotalLength())
        };
        // Test if the path length is correct
        if (isNaN(pathObj.length)) {
          if (window.console && console.warn) {
            console.warn(
              'Vivus [mapping]: cannot retrieve a path element length',
              path
            );
          }
          continue;
        }
        this.map.push(pathObj);
        path.style.strokeDasharray =
          pathObj.length + ' ' + (pathObj.length + this.dashGap * 2);
        path.style.strokeDashoffset = pathObj.length + this.dashGap;
        pathObj.length += this.dashGap;
        totalLength += pathObj.length;

        this.renderPath(i);
      }

      totalLength = totalLength === 0 ? 1 : totalLength;
      this.delay = this.delay === null ? this.duration / 3 : this.delay;
      this.delayUnit = this.delay / (paths.length > 1 ? paths.length - 1 : 1);

      // Reverse stack if asked
      if (this.reverseStack) {
        this.map.reverse();
      }

      for (i = 0; i < this.map.length; i++) {
        pathObj = this.map[i];

        switch (this.type) {
          case 'delayed':
            pathObj.startAt = this.delayUnit * i;
            pathObj.duration = this.duration - this.delay;
            break;

          case 'oneByOne':
            pathObj.startAt = (lengthMeter / totalLength) * this.duration;
            pathObj.duration = (pathObj.length / totalLength) * this.duration;
            break;

          case 'sync':
          case 'async':
          case 'nsync':
            pathObj.startAt = 0;
            pathObj.duration = this.duration;
            break;

          case 'scenario-sync':
            path = pathObj.el;
            pAttrs = this.parseAttr(path);
            pathObj.startAt =
              timePoint +
              (parsePositiveInt(pAttrs['data-delay'], this.delayUnit) || 0);
            pathObj.duration = parsePositiveInt(
              pAttrs['data-duration'],
              this.duration
            );
            timePoint =
              pAttrs['data-async'] !== undefined
                ? pathObj.startAt
                : pathObj.startAt + pathObj.duration;
            this.frameLength = Math.max(
              this.frameLength,
              pathObj.startAt + pathObj.duration
            );
            break;

          case 'scenario':
            path = pathObj.el;
            pAttrs = this.parseAttr(path);
            pathObj.startAt =
              parsePositiveInt(pAttrs['data-start'], this.delayUnit) || 0;
            pathObj.duration = parsePositiveInt(
              pAttrs['data-duration'],
              this.duration
            );
            this.frameLength = Math.max(
              this.frameLength,
              pathObj.startAt + pathObj.duration
            );
            break;
        }
        lengthMeter += pathObj.length;
        this.frameLength = this.frameLength || this.duration;
      }
    };

    /**
     * Interval method to draw the SVG from current
     * position of the animation. It update the value of
     * `currentFrame` and re-trace the SVG.
     *
     * It use this.handle to store the requestAnimationFrame
     * and clear it one the animation is stopped. So this
     * attribute can be used to know if the animation is
     * playing.
     *
     * Once the animation at the end, this method will
     * trigger the Vivus callback.
     *
     */
    Vivus.prototype.drawer = function() {
      var self = this;
      this.currentFrame += this.speed;

      if (this.currentFrame <= 0) {
        this.stop();
        this.reset();
      } else if (this.currentFrame >= this.frameLength) {
        this.stop();
        this.currentFrame = this.frameLength;
        this.trace();
        if (this.selfDestroy) {
          this.destroy();
        }
      } else {
        this.trace();
        this.handle = requestAnimFrame(function() {
          self.drawer();
        });
        return;
      }

      this.callback(this);
      if (this.instanceCallback) {
        this.instanceCallback(this);
        this.instanceCallback = null;
      }
    };

    /**
     * Draw the SVG at the current instant from the
     * `currentFrame` value. Here is where most of the magic is.
     * The trick is to use the `strokeDashoffset` style property.
     *
     * For optimisation reasons, a new property called `progress`
     * is added in each item of `map`. This one contain the current
     * progress of the path element. Only if the new value is different
     * the new value will be applied to the DOM element. This
     * method save a lot of resources to re-render the SVG. And could
     * be improved if the animation couldn't be played forward.
     *
     */
    Vivus.prototype.trace = function() {
      var i, progress, path, currentFrame;
      currentFrame =
        this.animTimingFunction(this.currentFrame / this.frameLength) *
        this.frameLength;
      for (i = 0; i < this.map.length; i++) {
        path = this.map[i];
        progress = (currentFrame - path.startAt) / path.duration;
        progress = this.pathTimingFunction(Math.max(0, Math.min(1, progress)));
        if (path.progress !== progress) {
          path.progress = progress;
          path.el.style.strokeDashoffset = Math.floor(path.length * (1 - progress));
          this.renderPath(i);
        }
      }
    };

    /**
     * Method forcing the browser to re-render a path element
     * from it's index in the map. Depending on the `forceRender`
     * value.
     * The trick is to replace the path element by it's clone.
     * This practice is not recommended because it's asking more
     * ressources, too much DOM manupulation..
     * but it's the only way to let the magic happen on IE.
     * By default, this fallback is only applied on IE.
     *
     * @param  {Number} index Path index
     */
    Vivus.prototype.renderPath = function(index) {
      if (this.forceRender && this.map && this.map[index]) {
        var pathObj = this.map[index],
          newPath = pathObj.el.cloneNode(true);
        pathObj.el.parentNode.replaceChild(newPath, pathObj.el);
        pathObj.el = newPath;
      }
    };

    /**
     * When the SVG object is loaded and ready,
     * this method will continue the initialisation.
     *
     * This this mainly due to the case of passing an
     * object tag in the constructor. It will wait
     * the end of the loading to initialise.
     *
     */
    Vivus.prototype.init = function() {
      // Set object variables
      this.frameLength = 0;
      this.currentFrame = 0;
      this.map = [];

      // Start
      new Pathformer(this.el);
      this.mapping();
      this.starter();

      if (this.onReady) {
        this.onReady(this);
      }
    };

    /**
     * Trigger to start of the animation.
     * Depending on the `start` value, a different script
     * will be applied.
     *
     * If the `start` value is not valid, an error will be thrown.
     * Even if technically, this is impossible.
     *
     */
    Vivus.prototype.starter = function() {
      switch (this.start) {
        case 'manual':
          return;

        case 'autostart':
          this.play();
          break;

        case 'inViewport':
          var self = this,
            listener = function() {
              if (self.isInViewport(self.parentEl, 1)) {
                self.play();
                window.removeEventListener('scroll', listener);
              }
            };
          window.addEventListener('scroll', listener);
          listener();
          break;
      }
    };

    /**
     * Controls
     **************************************
     */

    /**
     * Get the current status of the animation between
     * three different states: 'start', 'progress', 'end'.
     * @return {string} Instance status
     */
    Vivus.prototype.getStatus = function() {
      return this.currentFrame === 0
        ? 'start'
        : this.currentFrame === this.frameLength
        ? 'end'
        : 'progress';
    };

    /**
     * Reset the instance to the initial state : undraw
     * Be careful, it just reset the animation, if you're
     * playing the animation, this won't stop it. But just
     * make it start from start.
     *
     */
    Vivus.prototype.reset = function() {
      return this.setFrameProgress(0);
    };

    /**
     * Set the instance to the final state : drawn
     * Be careful, it just set the animation, if you're
     * playing the animation on rewind, this won't stop it.
     * But just make it start from the end.
     *
     */
    Vivus.prototype.finish = function() {
      return this.setFrameProgress(1);
    };

    /**
     * Set the level of progress of the drawing.
     *
     * @param {number} progress Level of progress to set
     */
    Vivus.prototype.setFrameProgress = function(progress) {
      progress = Math.min(1, Math.max(0, progress));
      this.currentFrame = Math.round(this.frameLength * progress);
      this.trace();
      return this;
    };

    /**
     * Play the animation at the desired speed.
     * Speed must be a valid number (no zero).
     * By default, the speed value is 1.
     * But a negative value is accepted to go forward.
     *
     * And works with float too.
     * But don't forget we are in JavaScript, se be nice
     * with him and give him a 1/2^x value.
     *
     * @param  {number} speed Animation speed [optional]
     */
    Vivus.prototype.play = function(speed, callback) {
      this.instanceCallback = null;

      if (speed && typeof speed === 'function') {
        this.instanceCallback = speed; // first parameter is actually the callback function
        speed = null;
      } else if (speed && typeof speed !== 'number') {
        throw new Error('Vivus [play]: invalid speed');
      }
      // if the first parameter wasn't the callback, check if the seconds was
      if (callback && typeof callback === 'function' && !this.instanceCallback) {
        this.instanceCallback = callback;
      }

      this.speed = speed || 1;
      if (!this.handle) {
        this.drawer();
      }
      return this;
    };

    /**
     * Stop the current animation, if on progress.
     * Should not trigger any error.
     *
     */
    Vivus.prototype.stop = function() {
      if (this.handle) {
        cancelAnimFrame(this.handle);
        this.handle = null;
      }
      return this;
    };

    /**
     * Destroy the instance.
     * Remove all bad styling attributes on all
     * path tags
     *
     */
    Vivus.prototype.destroy = function() {
      this.stop();
      var i, path;
      for (i = 0; i < this.map.length; i++) {
        path = this.map[i];
        path.el.style.strokeDashoffset = null;
        path.el.style.strokeDasharray = null;
        this.renderPath(i);
      }
    };

    /**
     * Utils methods
     * include methods from Codrops
     **************************************
     */

    /**
     * Method to best guess if a path should added into
     * the animation or not.
     *
     * 1. Use the `data-vivus-ignore` attribute if set
     * 2. Check if the instance must ignore invisible paths
     * 3. Check if the path is visible
     *
     * For now the visibility checking is unstable.
     * It will be used for a beta phase.
     *
     * Other improvments are planned. Like detecting
     * is the path got a stroke or a valid opacity.
     */
    Vivus.prototype.isInvisible = function(el) {
      var rect,
        ignoreAttr = el.getAttribute('data-ignore');

      if (ignoreAttr !== null) {
        return ignoreAttr !== 'false';
      }

      if (this.ignoreInvisible) {
        rect = el.getBoundingClientRect();
        return !rect.width && !rect.height;
      } else {
        return false;
      }
    };

    /**
     * Parse attributes of a DOM element to
     * get an object of {attributeName => attributeValue}
     *
     * @param  {object} element DOM element to parse
     * @return {object}         Object of attributes
     */
    Vivus.prototype.parseAttr = function(element) {
      var attr,
        output = {};
      if (element && element.attributes) {
        for (var i = 0; i < element.attributes.length; i++) {
          attr = element.attributes[i];
          output[attr.name] = attr.value;
        }
      }
      return output;
    };

    /**
     * Reply if an element is in the page viewport
     *
     * @param  {object} el Element to observe
     * @param  {number} h  Percentage of height
     * @return {boolean}
     */
    Vivus.prototype.isInViewport = function(el, h) {
      var scrolled = this.scrollY(),
        viewed = scrolled + this.getViewportH(),
        elBCR = el.getBoundingClientRect(),
        elHeight = elBCR.height,
        elTop = scrolled + elBCR.top,
        elBottom = elTop + elHeight;

      // if 0, the element is considered in the viewport as soon as it enters.
      // if 1, the element is considered in the viewport only when it's fully inside
      // value in percentage (1 >= h >= 0)
      h = h || 0;

      return elTop + elHeight * h <= viewed && elBottom >= scrolled;
    };

    /**
     * Get the viewport height in pixels
     *
     * @return {integer} Viewport height
     */
    Vivus.prototype.getViewportH = function() {
      var client = this.docElem.clientHeight,
        inner = window.innerHeight;

      if (client < inner) {
        return inner;
      } else {
        return client;
      }
    };

    /**
     * Get the page Y offset
     *
     * @return {integer} Page Y offset
     */
    Vivus.prototype.scrollY = function() {
      return window.pageYOffset || this.docElem.scrollTop;
    };

    setupEnv = function() {
      if (Vivus.prototype.docElem) {
        return;
      }

      /**
       * Alias for document element
       *
       * @type {DOMelement}
       */
      Vivus.prototype.docElem = window.document.documentElement;

      /**
       * Alias for `requestAnimationFrame` or
       * `setTimeout` function for deprecated browsers.
       *
       */
      requestAnimFrame = (function() {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(/* function */ callback) {
            return window.setTimeout(callback, 1000 / 60);
          }
        );
      })();

      /**
       * Alias for `cancelAnimationFrame` or
       * `cancelTimeout` function for deprecated browsers.
       *
       */
      cancelAnimFrame = (function() {
        return (
          window.cancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.oCancelAnimationFrame ||
          window.msCancelAnimationFrame ||
          function(id) {
            return window.clearTimeout(id);
          }
        );
      })();
    };

    /**
     * Parse string to integer.
     * If the number is not positive or null
     * the method will return the default value
     * or 0 if undefined
     *
     * @param {string} value String to parse
     * @param {*} defaultValue Value to return if the result parsed is invalid
     * @return {number}
     *
     */
    parsePositiveInt = function(value, defaultValue) {
      var output = parseInt(value, 10);
      return output >= 0 ? output : defaultValue;
    };


      {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = Vivus;
      }

    }());
    });

    /* public/assets/pro.svg generated by Svelte v3.23.0 */

    function create_fragment$1(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ width: "0.393333in" },
    		{ height: "0.38in" },
    		{ viewBox: "0 0 118 114" },
    		/*$$props*/ ctx[0]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	return {
    		c() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l(nodes) {
    			svg = claim_element(
    				nodes,
    				"svg",
    				{
    					xmlns: true,
    					width: true,
    					height: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg_nodes = children(svg);

    			path = claim_element(
    				svg_nodes,
    				"path",
    				{
    					id: true,
    					fill: true,
    					stroke: true,
    					"stroke-width": true,
    					d: true
    				},
    				1
    			);

    			children(path).forEach(detach);
    			svg_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(path, "id", "Selection");
    			attr(path, "fill", "black");
    			attr(path, "stroke", "black");
    			attr(path, "stroke-width", "1");
    			attr(path, "d", "M 8.00,32.00\n           C 13.55,32.00 27.75,30.98 31.96,33.74\n             40.26,39.19 39.99,53.19 30.98,57.83\n             27.60,59.57 19.07,59.00 15.00,59.00\n             15.00,59.00 15.00,77.00 15.00,77.00\n             15.00,77.00 8.00,77.00 8.00,77.00\n             8.00,77.00 8.00,32.00 8.00,32.00 Z\n           M 15.00,52.00\n           C 17.93,52.00 24.42,52.42 26.77,50.98\n             30.92,48.44 30.67,41.58 25.89,39.60\n             23.84,38.75 17.51,39.00 15.00,39.00\n             15.00,39.00 15.00,52.00 15.00,52.00 Z\n           M 54.00,47.00\n           C 57.79,40.51 67.75,40.42 72.30,46.21\n             74.96,49.60 74.96,53.92 75.00,58.00\n             75.00,58.00 67.00,58.00 67.00,58.00\n             65.74,47.11 57.22,47.94 54.74,54.04\n             53.50,57.08 54.00,72.68 54.00,77.00\n             54.00,77.00 46.00,77.00 46.00,77.00\n             46.00,77.00 46.00,43.00 46.00,43.00\n             46.00,43.00 53.00,43.00 53.00,43.00\n             53.00,43.00 54.00,47.00 54.00,47.00 Z\n           M 91.00,42.53\n           C 97.03,41.54 103.40,41.98 107.57,47.11\n             110.80,51.08 110.01,57.12 110.00,62.00\n             109.98,72.77 105.63,78.72 94.00,77.90\n             80.74,76.98 80.87,67.20 81.00,57.00\n             81.11,49.10 83.20,45.04 91.00,42.53 Z\n           M 94.02,49.47\n           C 92.15,50.23 91.20,50.29 90.02,52.23\n             88.97,53.95 85.80,72.98 96.98,70.53\n             104.94,68.78 106.62,48.88 94.02,49.47 Z");
    			set_svg_attributes(svg, svg_data);
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, path);
    		},
    		p(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ width: "0.393333in" },
    				{ height: "0.38in" },
    				{ viewBox: "0 0 118 114" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class pro extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
    	}
    }

    /* public/assets/d.svg generated by Svelte v3.23.0 */

    function create_fragment$2(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ width: "0.123333in" },
    		{ height: "0.38in" },
    		{ viewBox: "0 0 37 114" },
    		/*$$props*/ ctx[0]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	return {
    		c() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l(nodes) {
    			svg = claim_element(
    				nodes,
    				"svg",
    				{
    					xmlns: true,
    					width: true,
    					height: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg_nodes = children(svg);

    			path = claim_element(
    				svg_nodes,
    				"path",
    				{
    					id: true,
    					fill: true,
    					stroke: true,
    					"stroke-width": true,
    					d: true
    				},
    				1
    			);

    			children(path).forEach(detach);
    			svg_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(path, "id", "Selection");
    			attr(path, "fill", "black");
    			attr(path, "stroke", "black");
    			attr(path, "stroke-width", "1");
    			attr(path, "d", "M 23.00,32.00\n           C 23.00,32.00 31.00,32.00 31.00,32.00\n             31.00,32.00 31.00,77.00 31.00,77.00\n             27.15,76.99 24.61,77.88 23.00,74.00\n             20.93,75.63 19.65,76.86 17.00,77.57\n             14.60,78.21 11.31,77.95 9.02,76.99\n             0.49,73.44 1.90,63.53 2.00,56.00\n             2.12,47.18 7.28,39.84 17.00,42.43\n             19.65,43.14 20.93,44.37 23.00,46.00\n             23.00,46.00 23.00,32.00 23.00,32.00 Z\n           M 15.02,49.49\n           C 13.14,50.24 12.21,50.28 11.02,52.23\n             9.75,54.31 7.10,73.03 17.91,70.53\n             24.69,68.96 26.62,49.43 15.02,49.49 Z");
    			set_svg_attributes(svg, svg_data);
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, path);
    		},
    		p(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ width: "0.123333in" },
    				{ height: "0.38in" },
    				{ viewBox: "0 0 37 114" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class d extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
    	}
    }

    /* public/assets/uctde.svg generated by Svelte v3.23.0 */

    function create_fragment$3(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ width: "0.736667in" },
    		{ height: "0.38in" },
    		{ viewBox: "0 0 221 114" },
    		/*$$props*/ ctx[0]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	return {
    		c() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l(nodes) {
    			svg = claim_element(
    				nodes,
    				"svg",
    				{
    					xmlns: true,
    					width: true,
    					height: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg_nodes = children(svg);

    			path = claim_element(
    				svg_nodes,
    				"path",
    				{
    					id: true,
    					fill: true,
    					stroke: true,
    					"stroke-width": true,
    					d: true
    				},
    				1
    			);

    			children(path).forEach(detach);
    			svg_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(path, "id", "Selection");
    			attr(path, "fill", "black");
    			attr(path, "stroke", "black");
    			attr(path, "stroke-width", "1");
    			attr(path, "d", "M 84.00,32.00\n           C 84.00,32.00 92.00,32.00 92.00,32.00\n             92.00,32.00 92.00,43.00 92.00,43.00\n             92.00,43.00 105.00,43.00 105.00,43.00\n             105.00,43.00 105.00,50.00 105.00,50.00\n             105.00,50.00 92.00,50.00 92.00,50.00\n             92.00,54.17 90.80,66.63 94.31,68.98\n             96.41,70.38 102.35,70.00 105.00,70.00\n             105.00,70.00 105.00,77.00 105.00,77.00\n             101.06,77.00 92.27,77.56 89.05,75.83\n             81.93,71.98 84.00,57.12 84.00,50.00\n             84.00,50.00 75.00,50.00 75.00,50.00\n             75.00,50.00 75.00,43.00 75.00,43.00\n             75.00,43.00 84.00,43.00 84.00,43.00\n             84.00,43.00 84.00,32.00 84.00,32.00 Z\n           M 150.00,32.00\n           C 150.00,32.00 165.00,32.00 165.00,32.00\n             181.40,32.23 179.00,45.30 179.00,57.00\n             179.00,61.33 179.62,67.29 177.26,70.98\n             171.82,79.52 158.79,77.00 150.00,77.00\n             150.00,77.00 150.00,32.00 150.00,32.00 Z\n           M 158.00,70.00\n           C 161.19,70.00 166.14,70.49 168.70,68.40\n             173.38,64.58 173.38,44.42 168.70,40.60\n             166.14,38.51 161.19,39.00 158.00,39.00\n             158.00,39.00 158.00,70.00 158.00,70.00 Z\n           M 69.00,65.00\n           C 65.64,82.59 40.50,82.93 39.09,64.00\n             38.65,58.06 38.65,49.88 43.34,45.56\n             50.34,39.10 66.24,40.52 69.00,55.00\n             66.65,54.99 63.67,55.26 61.59,54.05\n             59.55,52.86 56.57,48.05 52.02,50.08\n             45.06,53.17 44.80,69.08 53.01,70.46\n             57.42,71.20 59.57,67.20 61.59,65.98\n             63.64,64.73 66.67,65.01 69.00,65.00 Z\n           M 216.00,68.25\n           C 212.15,79.25 198.00,80.63 191.21,74.58\n             187.19,71.00 187.03,66.96 187.00,62.00\n             186.98,57.14 186.36,51.13 189.51,47.11\n             195.13,39.93 209.22,40.38 214.26,48.04\n             216.62,51.63 216.00,57.76 216.00,62.00\n             216.00,62.00 195.00,62.00 195.00,62.00\n             196.04,74.81 205.26,69.45 209.00,68.25\n             211.28,67.90 213.66,68.01 216.00,68.25 Z\n           M 3.00,43.00\n           C 3.00,43.00 10.00,43.00 10.00,43.00\n             10.00,47.28 9.64,61.83 10.57,64.98\n             11.54,68.27 14.22,71.24 17.96,70.16\n             25.41,67.99 23.00,49.30 23.00,43.00\n             23.00,43.00 31.00,43.00 31.00,43.00\n             31.00,49.85 31.88,66.50 28.84,71.96\n             24.36,79.98 8.83,80.17 4.45,71.96\n             2.02,67.39 3.00,49.13 3.00,43.00 Z\n           M 209.00,57.00\n           C 206.84,46.93 195.89,46.11 195.00,57.00\n             195.00,57.00 209.00,57.00 209.00,57.00 Z");
    			set_svg_attributes(svg, svg_data);
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, path);
    		},
    		p(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ width: "0.736667in" },
    				{ height: "0.38in" },
    				{ viewBox: "0 0 221 114" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class uctde extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
    	}
    }

    /* public/assets/ign.svg generated by Svelte v3.23.0 */

    function create_fragment$4(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ width: "0.49in" },
    		{ height: "0.37in" },
    		{ viewBox: "0 0 147 111" },
    		/*$$props*/ ctx[0]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	return {
    		c() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l(nodes) {
    			svg = claim_element(
    				nodes,
    				"svg",
    				{
    					xmlns: true,
    					width: true,
    					height: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg_nodes = children(svg);

    			path = claim_element(
    				svg_nodes,
    				"path",
    				{
    					id: true,
    					fill: true,
    					stroke: true,
    					"stroke-width": true,
    					d: true
    				},
    				1
    			);

    			children(path).forEach(detach);
    			svg_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(path, "id", "Selection");
    			attr(path, "fill", "black");
    			attr(path, "stroke", "black");
    			attr(path, "stroke-width", "1");
    			attr(path, "d", "M 48.60,30.02\n           C 56.10,26.87 59.82,33.17 55.68,35.98\n             52.00,38.47 44.25,36.23 48.60,30.02 Z\n           M 80.00,61.00\n           C 77.25,59.23 74.08,57.44 73.35,53.96\n             71.75,46.30 82.11,36.64 94.00,46.00\n             95.61,42.12 98.15,43.01 102.00,43.00\n             102.00,43.00 102.00,77.00 102.00,77.00\n             102.00,77.00 90.00,69.00 90.00,69.00\n             92.48,64.86 94.94,61.10 93.69,56.00\n             92.34,50.54 86.76,47.30 82.51,52.23\n             80.28,54.81 80.16,57.79 80.00,61.00 Z\n           M 118.00,46.00\n           C 120.07,44.37 121.35,43.14 124.00,42.43\n             143.04,37.35 139.00,66.47 139.00,77.00\n             139.00,77.00 130.89,77.00 130.89,77.00\n             130.89,77.00 130.89,56.00 130.89,56.00\n             130.29,53.36 128.79,50.57 125.96,49.88\n             122.61,49.07 119.83,52.18 118.74,55.00\n             117.52,58.14 118.00,72.70 118.00,77.00\n             118.00,77.00 110.00,77.00 110.00,77.00\n             110.00,77.00 110.00,43.00 110.00,43.00\n             113.85,43.01 116.39,42.12 118.00,46.00 Z");
    			set_svg_attributes(svg, svg_data);
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, path);
    		},
    		p(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ width: "0.49in" },
    				{ height: "0.37in" },
    				{ viewBox: "0 0 147 111" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class ign extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});
    	}
    }

    /* public/assets/sig.svg generated by Svelte v3.23.0 */

    function create_fragment$5(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ width: "0.493333in" },
    		{ height: "0.376667in" },
    		{ viewBox: "0 0 148 113" },
    		/*$$props*/ ctx[0]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	return {
    		c() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l(nodes) {
    			svg = claim_element(
    				nodes,
    				"svg",
    				{
    					xmlns: true,
    					width: true,
    					height: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg_nodes = children(svg);

    			path = claim_element(
    				svg_nodes,
    				"path",
    				{
    					id: true,
    					fill: true,
    					stroke: true,
    					"stroke-width": true,
    					d: true
    				},
    				1
    			);

    			children(path).forEach(detach);
    			svg_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(path, "id", "Selection");
    			attr(path, "fill", "black");
    			attr(path, "stroke", "black");
    			attr(path, "stroke-width", "1");
    			attr(path, "d", "M 2.00,67.00\n           C 13.09,67.04 9.39,69.40 15.01,70.53\n             17.43,71.02 23.03,69.71 21.80,66.18\n             20.87,63.51 16.35,63.03 14.00,62.58\n             7.92,61.41 2.23,59.45 2.49,51.79\n             2.93,39.43 27.85,37.21 31.00,51.79\n             31.00,51.79 25.00,51.79 25.00,51.79\n             21.62,51.09 14.49,46.81 11.91,51.79\n             10.18,54.50 14.95,55.90 17.00,56.37\n             24.74,58.17 31.94,58.23 30.89,69.00\n             29.69,81.22 8.61,79.93 3.74,72.89\n             2.33,70.87 2.27,69.32 2.00,67.00 Z\n           M 42.00,43.00\n           C 46.10,43.00 53.57,42.33 56.85,44.74\n             61.70,48.28 60.00,64.06 60.00,70.00\n             60.00,70.00 70.00,70.00 70.00,70.00\n             70.00,70.00 70.00,77.00 70.00,77.00\n             70.00,77.00 40.00,77.00 40.00,77.00\n             40.00,77.00 40.00,70.00 40.00,70.00\n             40.00,70.00 52.00,70.00 52.00,70.00\n             52.00,70.00 52.00,50.00 52.00,50.00\n             52.00,50.00 42.00,50.00 42.00,50.00\n             42.00,50.00 42.00,43.00 42.00,43.00 Z\n           M 76.00,60.00\n           C 81.17,62.21 90.98,69.87 95.00,74.00\n             81.89,77.19 76.04,73.82 76.00,60.00 Z\n           M 97.00,76.00\n           C 97.00,76.00 104.00,80.00 104.00,80.00\n             99.11,90.23 90.51,88.00 81.00,88.00\n             81.00,88.00 81.00,81.00 81.00,81.00\n             88.46,81.00 91.98,82.44 97.00,76.00 Z");
    			set_svg_attributes(svg, svg_data);
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, path);
    		},
    		p(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ width: "0.493333in" },
    				{ height: "0.376667in" },
    				{ viewBox: "0 0 148 113" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class sig extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});
    	}
    }

    /* src/product-design.svelte generated by Svelte v3.23.0 */
    const file$1 = "src/product-design.svelte";

    function create_fragment$6(ctx) {
    	let div8;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let t1;
    	let div3;
    	let t2;
    	let div4;
    	let p0;
    	let t3;
    	let p1;
    	let t4;
    	let div7;
    	let div5;
    	let t5;
    	let div6;
    	let current;

    	const pro$1 = new pro({
    			props: { class: "h-full w-full" },
    			$$inline: true
    		});

    	const d$1 = new d({
    			props: { class: "h-full w-full" },
    			$$inline: true
    		});

    	const uctde$1 = new uctde({
    			props: { class: "h-full w-full" },
    			$$inline: true
    		});

    	const sig$1 = new sig({
    			props: { class: "h-full w-full" },
    			$$inline: true
    		});

    	const ign$1 = new ign({
    			props: { class: "h-full w-full" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div0 = element("div");
    			create_component(pro$1.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t1 = space();
    			div3 = element("div");
    			create_component(d$1.$$.fragment);
    			t2 = space();
    			div4 = element("div");
    			p0 = element("p");
    			t3 = space();
    			p1 = element("p");
    			create_component(uctde$1.$$.fragment);
    			t4 = space();
    			div7 = element("div");
    			div5 = element("div");
    			create_component(sig$1.$$.fragment);
    			t5 = space();
    			div6 = element("div");
    			create_component(ign$1.$$.fragment);
    			attr_dev(div0, "class", "piece circle svelte-1o0ahp8");
    			add_location(div0, file$1, 266, 1, 13946);
    			attr_dev(div1, "class", "inv-circle-section svelte-1o0ahp8");
    			add_location(div1, file$1, 270, 2, 14035);
    			attr_dev(div2, "class", "piece svelte-1o0ahp8");
    			add_location(div2, file$1, 269, 1, 14013);
    			attr_dev(div3, "class", "d svelte-1o0ahp8");
    			add_location(div3, file$1, 272, 1, 14083);
    			attr_dev(p0, "class", "top svelte-1o0ahp8");
    			add_location(p0, file$1, 276, 2, 14165);
    			attr_dev(p1, "class", "bottom svelte-1o0ahp8");
    			add_location(p1, file$1, 277, 2, 14187);
    			attr_dev(div4, "class", "piece rect svelte-1o0ahp8");
    			add_location(div4, file$1, 275, 1, 14138);
    			attr_dev(div5, "class", "lower-tri svelte-1o0ahp8");
    			add_location(div5, file$1, 282, 2, 14279);
    			attr_dev(div6, "class", "upper-tri svelte-1o0ahp8");
    			add_location(div6, file$1, 285, 2, 14346);
    			attr_dev(div7, "class", "piece svelte-1o0ahp8");
    			add_location(div7, file$1, 281, 1, 14257);
    			attr_dev(div8, "class", "flex justify-center items-center");
    			add_location(div8, file$1, 265, 0, 13898);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			mount_component(pro$1, div0, null);
    			append_dev(div8, t0);
    			append_dev(div8, div2);
    			append_dev(div2, div1);
    			append_dev(div8, t1);
    			append_dev(div8, div3);
    			mount_component(d$1, div3, null);
    			append_dev(div8, t2);
    			append_dev(div8, div4);
    			append_dev(div4, p0);
    			append_dev(div4, t3);
    			append_dev(div4, p1);
    			mount_component(uctde$1, p1, null);
    			append_dev(div8, t4);
    			append_dev(div8, div7);
    			append_dev(div7, div5);
    			mount_component(sig$1, div5, null);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			mount_component(ign$1, div6, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pro$1.$$.fragment, local);
    			transition_in(d$1.$$.fragment, local);
    			transition_in(uctde$1.$$.fragment, local);
    			transition_in(sig$1.$$.fragment, local);
    			transition_in(ign$1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pro$1.$$.fragment, local);
    			transition_out(d$1.$$.fragment, local);
    			transition_out(uctde$1.$$.fragment, local);
    			transition_out(sig$1.$$.fragment, local);
    			transition_out(ign$1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_component(pro$1);
    			destroy_component(d$1);
    			destroy_component(uctde$1);
    			destroy_component(sig$1);
    			destroy_component(ign$1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Product_design> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Product_design", $$slots, []);
    	$$self.$capture_state = () => ({ Pro: pro, D: d, UctDe: uctde, Ign: ign, Sig: sig });
    	return [];
    }

    class Product_design extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Product_design",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.23.0 */
    const file$2 = "src/App.svelte";

    // (26:6) <Typewriter interval={70}>
    function create_default_slot(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Front End Development";
    			attr_dev(h1, "class", "md:text-5xl");
    			add_location(h1, file$2, 26, 12, 783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(26:6) <Typewriter interval={70}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let nav;
    	let span0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let button;
    	let t7;
    	let div2;
    	let t8;
    	let div1;
    	let current;

    	const typewriter = new Typewriter({
    			props: {
    				interval: 70,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const productdesign = new Product_design({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			nav = element("nav");
    			span0 = element("span");
    			span0.textContent = "Remi Marchand";
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "Resume";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "Github";
    			t5 = space();
    			button = element("button");
    			button.textContent = "Contact";
    			t7 = space();
    			div2 = element("div");
    			create_component(typewriter.$$.fragment);
    			t8 = space();
    			div1 = element("div");
    			create_component(productdesign.$$.fragment);
    			attr_dev(span0, "class", "font-semibold text-xl text-white tracking-tight mr-6");
    			add_location(span0, file$2, 13, 8, 389);
    			attr_dev(span1, "class", "ml-4");
    			add_location(span1, file$2, 16, 12, 528);
    			attr_dev(span2, "class", "ml-4");
    			add_location(span2, file$2, 17, 12, 573);
    			attr_dev(div0, "class", "block flex-grow");
    			add_location(div0, file$2, 15, 8, 486);
    			attr_dev(button, "class", "m");
    			add_location(button, file$2, 20, 8, 630);
    			attr_dev(nav, "class", "flex items-center justify-between flex-wrap text-white bg-orange-500 p-5");
    			add_location(nav, file$2, 12, 4, 294);
    			attr_dev(div1, "class", "w-full");
    			add_location(div1, file$2, 28, 8, 864);
    			attr_dev(div2, "class", "px-4 py-4 text-center");
    			add_location(div2, file$2, 24, 4, 702);
    			add_location(main, file$2, 11, 0, 283);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, nav);
    			append_dev(nav, span0);
    			append_dev(nav, t1);
    			append_dev(nav, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(nav, t5);
    			append_dev(nav, button);
    			append_dev(main, t7);
    			append_dev(main, div2);
    			mount_component(typewriter, div2, null);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			mount_component(productdesign, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const typewriter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				typewriter_changes.$$scope = { dirty, ctx };
    			}

    			typewriter.$set(typewriter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(typewriter.$$.fragment, local);
    			transition_in(productdesign.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(typewriter.$$.fragment, local);
    			transition_out(productdesign.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(typewriter);
    			destroy_component(productdesign);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	onMount(() => {
    		new vivus("design-svg",
    		{ duration: 400 },
    		() => {
    				
    			});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		Typewriter,
    		Vivus: vivus,
    		ProductDesign: Product_design
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
