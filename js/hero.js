
/* Hoorvia Store — neo-cyberpunk Three.js hero. Degrades gracefully. */
(function(){
  var canvas = document.getElementById('gl');
  if(!canvas) return;
  function fallback(){ canvas.style.display='none'; }
  try{
    if(!window.WebGLRenderingContext) return fallback();
    var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
  }catch(e){ return fallback(); }
  var wrap = canvas.parentElement;
  function size(){ var w=wrap.clientWidth,h=wrap.clientHeight; renderer.setSize(w,h,false); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); camera.aspect=w/h; camera.updateProjectionMatrix(); }
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08080f, 0.055);
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 1.6, 11);
  var PURPLE = 0x8B5CF6, LIME = 0xA3E635;
  scene.add(new THREE.AmbientLight(0x404060, 1.2));
  var pl = new THREE.PointLight(PURPLE, 2.2, 40); pl.position.set(-6,4,4); scene.add(pl);
  var ll = new THREE.PointLight(LIME, 1.4, 40); ll.position.set(6,-2,5); scene.add(ll);
  function wire(geo, color, op){ return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:color, wireframe:true, transparent:true, opacity:op||0.55})); }
  function solid(geo, color, op){ return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color:color, transparent:true, opacity:op||0.14, roughness:.35, metalness:.8})); }
  var group = new THREE.Group(); scene.add(group);
  var shapes = [];
  function add(mesh, x,y,z, rs){ mesh.position.set(x,y,z); mesh.userData.rs=rs; group.add(mesh); shapes.push(mesh); return mesh; }
  var knot = wire(new THREE.TorusKnotGeometry(1.15,.32,140,18), PURPLE, .5); add(knot, -3.4, 1.2, 0, {x:.0022,y:.0031});
  var knotS = solid(new THREE.TorusKnotGeometry(1.15,.32,140,18), PURPLE, .07); knotS.position.copy(knot.position); group.add(knotS); shapes.push(Object.assign(knotS,{userData:{rs:{x:.0022,y:.0031}}}));
  var ico = wire(new THREE.IcosahedronGeometry(1,0), LIME, .6); add(ico, 3.6, 0.4, -1, {x:.003,y:.004});
  var tor = wire(new THREE.TorusGeometry(.8,.22,14,40), PURPLE, .55); add(tor, 0.4, -1.6, 1.5, {x:.004,y:.002});
  var oct = wire(new THREE.OctahedronGeometry(.7,0), LIME, .5); add(oct, -0.6, 2.6, -2, {x:.003,y:.005});
  var ring = wire(new THREE.TorusGeometry(1.9,.03,8,80), PURPLE, .35); ring.rotation.x=Math.PI/2.3; add(ring, 3.6, 0.4, -1, {x:0,y:.002});
  // neon grid floor (perspective cyberpunk grid)
  var grid = new THREE.GridHelper(60, 60, PURPLE, 0x2a1e5e);
  grid.position.y = -3.2; grid.material.transparent = true; grid.material.opacity = .35; scene.add(grid);
  var grid2 = new THREE.GridHelper(60, 12, LIME, 0x2a3a1e);
  grid2.position.y = -3.18; grid2.material.transparent = true; grid2.material.opacity = .12; scene.add(grid2);
  // particles
  var pGeo = new THREE.BufferGeometry(); var N=260; var pos=new Float32Array(N*3);
  for(var i=0;i<N;i++){ pos[i*3]=(Math.random()-.5)*26; pos[i*3+1]=(Math.random()-.5)*14; pos[i*3+2]=(Math.random()-.5)*18; }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  var pts = new THREE.Points(pGeo, new THREE.PointsMaterial({color:PURPLE,size:.06,transparent:true,opacity:.7}));
  scene.add(pts);
  // mouse parallax
  var mx=0,my=0,tx=0,ty=0;
  window.addEventListener('mousemove',function(e){ tx=(e.clientX/window.innerWidth-.5); ty=(e.clientY/window.innerHeight-.5); },{passive:true});
  var clock = new THREE.Clock();
  size(); window.addEventListener('resize', size);
  (function anim(){
    requestAnimationFrame(anim);
    var t = clock.getElapsedTime();
    mx += (tx-mx)*.04; my += (ty-my)*.04;
    shapes.forEach(function(m,i){ m.rotation.x += m.userData.rs.x; m.rotation.y += m.userData.rs.y; m.position.y += Math.sin(t*1.1+i*1.7)*.0016; });
    knotS.position.copy(knot.position); knotS.rotation.copy(knot.rotation);
    grid.position.z = (t*.6)%1; grid2.position.z = (t*.6)%1;
    pts.rotation.y = t*.02;
    group.rotation.y = mx*.35; group.rotation.x = my*.22;
    camera.position.x += ((mx*1.4)-camera.position.x)*.05;
    camera.position.y += ((1.6-my*1.1)-camera.position.y)*.05;
    camera.lookAt(0,.4,0);
    renderer.render(scene,camera);
  })();
})();
