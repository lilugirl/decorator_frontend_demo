import _ from 'lodash';

function init(){
  arrComponent.forEach(comp=>{
     document.querySelectorAll(comp.selector).forEach(node=>{
         let inst=new comp.class();
         console.log('inst',inst);
         node.innerHTML=comp.template(inst);
         console.log('inst events',inst._events);
         Object.keys(inst._events).forEach(type=>{
             node.addEventListener(type,function(e){
                 console.log('e.target',e.target);
                 inst._events[type].forEach(item=>{
                     if(e.target.matches(item.selector)){
                         console.log('matches');
                        let rerender= item.fn.call(inst,e);
                        if(rerender)  node.innerHTML=comp.template(inst);
                     }else{
                         console.log('not match')
                     }
                 })
             })
         })
     })
  })
}

const arrComponent=[];

function Component(config){
    config.template=_.template(config.template);
    return (target)=>{
        console.log('component target',target);
        config.class=target;
        arrComponent.push(config);
        console.log('arrComponent',arrComponent);
       
    }
}
function event(type,selector){
    return (target,key,descriptor)=>{
      console.log('event target',target);
      console.log('event key',key);
      console.log('event descriptor',descriptor);
      if(!target._events) target._events={};
      if(!target._events[type]) target._events[type]=[];

      target._events[type].push({
          selector,
          fn:descriptor.value
      })
      return descriptor;
    }
}

@Component({
    selector:'my-app',
    template:`
      <h1>Todo List </h1>
      <p><input /></p>
      <ul>
        <% todos.forEach(todo=>{ %>
            <li style='text-decoration:<%= todo.done? "line-through":"none" %>'><%= todo.text %></li>
        <% }) %>
      </ul>
    `
})
class TodoListComponent{
    todos=[];
    constructor(){
        this.todos.push({text:'烧菜'});
        this.todos.push({text:'喂猫'});
    }
    
    @event('click','li')
    handleClick(e){
        let todo=this.todos.filter(todo=>todo.text===e.target.innerText.trim())[0]
        todo.done=!todo.done;
        return true; // cheat的做法 如果返回为true 表示组件需要重新渲染
    }

    @event('keypress','input')
    handleKeypress(e){
      if(e.key==='Enter'){
          this.todos.push({text:e.target.value});
         // e.target.value='';
          return true;
      }
    }
}
init();