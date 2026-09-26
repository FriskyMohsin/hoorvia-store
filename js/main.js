
/* Hoorvia Store — nav, tilt, reveal, bid form, faq, typewriter */
(function(){
  "use strict";
  // mobile nav
  var burger=document.querySelector('.burger'), nav=document.querySelector('.nav');
  if(burger&&nav){ burger.addEventListener('click',function(){ nav.classList.toggle('open'); }); }
  // typewriter (hero terminal line)
  var tw=document.getElementById('typewriter');
  if(tw){
    var txt=tw.getAttribute('data-text')||'';
    var i=0;
    (function type(){
      if(i<=txt.length){ tw.textContent=txt.slice(0,i); i++; setTimeout(type, 34+Math.random()*40); }
    })();
  }
  // 3D tilt on cards
  if(window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('[data-tilt]').forEach(function(card){
      card.addEventListener('mousemove',function(e){
        var r=card.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform='perspective(900px) rotateX('+(-y*9)+'deg) rotateY('+(x*11)+'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave',function(){ card.style.transform=''; });
    });
  }
  // scroll reveal
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  // bid form -> WhatsApp deep link
  document.querySelectorAll('.bidform').forEach(function(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true;
      form.querySelectorAll('[data-req]').forEach(function(inp){
        var fld=inp.closest('.fld');
        var bad=!inp.value.trim();
        if(inp.type==='email'&&inp.value.trim()){ bad=!/^\S+@\S+\.\S+$/.test(inp.value.trim()); }
        fld.classList.toggle('bad',bad);
        if(bad) ok=false;
      });
      if(!ok){ var first=form.querySelector('.fld.bad input,.fld.bad textarea'); if(first) first.focus(); return; }
      var g=function(n){ return form.querySelector('[name='+n+']').value.trim(); };
      var msg='NEW BID -- '+form.getAttribute('data-service')+'\nName: '+g('name')+'\nContact: '+g('contact')+'\nBudget: '+g('budget')+' '+g('currency')+'\nDetails: '+g('details');
      window.open('https://wa.me/966532448127?text='+encodeURIComponent(msg),'_blank');
      var note=form.querySelector('.bid-note');
      if(note){ note.style.display='block'; }
    });
    form.querySelectorAll('[data-req]').forEach(function(inp){
      inp.addEventListener('input',function(){ inp.closest('.fld').classList.remove('bad'); });
    });
  });
})();
