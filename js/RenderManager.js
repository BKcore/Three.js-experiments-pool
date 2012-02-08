/*!
 * THREE.RenderManager helps handling multiple scenes, cameras and render loops.
 * 
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 */

THREE = THREE || {};

THREE.RenderManager = function(renderer)
{
	this.renderer = renderer;
	this.time = Date.now()/1000;

	this.renders = {};
	this.current = {};
	this.size = 0;

	this.defaultRenderMethod = function(delta, renderer)
	{
		renderer.render(this.scene, this.camera);
	};
};

THREE.RenderManager.prototype.add = function(id, scene, camera, render, objects)
{
	render = render || this.defaultRenderMethod;
	objects = objects || {};

	this.renders[id] = {scene: scene, camera: camera, render: render, objects: objects};

	if(this.size == 0) this.current = this.renders[id];

	this.size++;
};

THREE.RenderManager.prototype.remove = function(id)
{
	if(id in this.renders)
	{
		delete this.renders[id];
		this.size--;
	}
};

THREE.RenderManager.prototype.renderCurrent = function()
{
	if(this.current && this.current.render)
	{
		var now = Date.now()/1000;
		var delta = now - this.time;
		this.time = now;

		this.current.render.call(this.current, delta, this.renderer);
	}
	else console.warn('RenderManager: No current render defined.');
};

THREE.RenderManager.prototype.setCurrent = function(id)
{
	if(id in this.renders)
	{
		this.current = this.renders[id];
	}
	else console.warn('RenderManager: Render "'+id+'" not found.');
};