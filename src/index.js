import _ from 'lodash';

function init(){
  arrComponent.forEach(comp=>{
     document.querySelectorAll(comp.selector).forEach(node=>{
         console.log('comp.class',comp.class);
         let inst=new comp.class();
         node.innerHTML=comp.template(inst);
         inst.doCalc();
         Object.keys(inst._events).forEach(type=>{
             node.addEventListener(type,function(e){
                 inst._events[type].forEach(item=>{
                     if(e.target.matches(item.selector)){
                        let rerender= item.fn.call(inst,e);
                        if(rerender)  node.innerHTML=comp.template(inst);
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
        config.class=target;
        arrComponent.push(config);    
    }
}
function event(type,selector){
    return (target,key,descriptor)=>{
      if(!target._events) target._events={};
      if(!target._events[type]) target._events[type]=[];

      target._events[type].push({
          selector,
          fn:descriptor.value
      })
      return descriptor;
    }
}

function time(target,key,descriptor){
    // target is the class proptotype 
    // this is the instance
    console.log('time target',target);
    console.log('time key',key);
    console.log('time descriptor',descriptor);
    console.log('time this',this);
    const originalFn=descriptor.value;

    let i=0;
    descriptor.value=function(...args){
        let id=i++;
        console.time(key+i);
        let value=originalFn.apply(this,args);
        console.timeEnd(key+id);
        return value;
    }
}

@Component({
    selector:'my-app',
    template:`
      <h1>Todo List </h1>
      <p><button id="buttonA">获取A</button></p>
      <p><button id="buttonB">获取B</button></p>
      <p><button id="buttonC">增加删除权限</button></p>
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
    constructor(service){
        console.log('service',service)
        this.todos.push({text:'烧菜'});
        this.todos.push({text:'喂猫'});
    }
    
   
    @event('click','li')
    @time
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
    
    @event('click','#buttonA')
    fetchA(){
        Service.fetchA().then(res=>{
            alert(res)
        });
    }

    @event('click','#buttonB')
    fetchB(){
       alert(new Service().fetchB());
    }

    @event('click','#buttonC')
    addDelete(){
        permissionList.push('delete');
    }

    @time
    doCalc(){
        console.log('docCale this',this);
        for(let i=0;i<10000;i++){

        }
        console.log('done')
    }
}

const permissionList=['read','update'];

function can(permission){
    return (target,key,descriptor)=>{
        console.log('can target',target.name);
        const origFn=descriptor.value.bind(target);
        descriptor.value=function(...args){
            if(permissionList.includes(permission)){
             return  origFn(...args);
            
            }else{
               return new Error('您没有操作权限');            
            }
        }
       
        return descriptor;

    }
}

class Service{ 
    @can('update')
    static fetchA(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve('A')
            },1000)
        })
    }

    @can('delete')
    fetchB(){
        return 'B'
    }
}
init();