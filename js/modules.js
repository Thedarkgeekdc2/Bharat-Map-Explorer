/* Mode registry. When a module is built, set status:'ready' and add its view in app.js (MODE_VIEWS). */
window.MODES=[
 {id:'learn',  icon:'📖',color:'blue',   module:3,status:'ready'},
 {id:'explore',icon:'🗺️',color:'green',  module:1,status:'ready'},
 {id:'build',  icon:'🧩',color:'saffron',module:4,status:'ready'},
 {id:'quiz',   icon:'🎯',color:'plum',   module:5,status:'ready'}
];

/* Registry for mode screens. Each ready module sets MODE_VIEWS[id]=(el,ctx)=>{...} */
window.MODE_VIEWS=window.MODE_VIEWS||{};
