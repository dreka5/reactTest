import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { render } from '@testing-library/react';
import Select from 'react-select'


var API = require('./api');



class FirmBox extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      root:props.root,
      elem:props.curFirm, 
      baseId:-1,
      update:false
    }
  }

  ///очистка контрола
  clear(){
    this.state.baseId--;
    var elem=this.state.elem;
    for(var q in elem)
         elem[q]="";
     elem['fid']=this.state.baseId;   
     this.setState({elem:elem,update:false})
  }  
  
  componentDidUpdate(rooter){
    let localFirm=this.state.elem;
    let currentFirm=rooter.root.state.currentFirm;
    // антилуп
    if (currentFirm===localFirm) return;
    this.setState({elem:currentFirm,update:true});
  }

  AddElement(elem){
    var T=this;
    async function add(){
      var res= await API.Func.AddFirm(elem);
      if (res!=null&&res.createdId>0)
      {
        elem.id=res.createdId;
        T.props.root.AddFirm({ ...elem})
        T.clear();   
      }
    }
    add();
  }
  UpdateElement(elem) {
    var T=this;
    async function update(){
      var res= await API.Func.UpdateFirm(elem);
      if (res!=null&&res.createdId>0)
      {
        elem.id=res.createdId;
        T.props.root.UpdateFirm({ ...elem})
      }
    }
    update();
  }
 

  handleChange(event,fieldName) {
    let a=this.state.elem;
    a[fieldName]=event.target.value;
    this.setState({elem:a});
  }

  render()
     {
      let elem=this.state.elem;
    return (
      <div className ="mainBlock">
        <span>id</span>
        <br/>
        <input value={elem.fid} readOnly className="deactive" ></input>
        <br/>
        <label>
        Фирма
        <br/>
        <input type="text" value={elem.name} onChange={(e)=>{this.handleChange(e,"name")}} />
        </label>
        <br/>
        <label>
        Инн
        <br/>
        <input type="text" value={elem.inn} onChange={(e)=>{this.handleChange(e,"inn")}} />
        </label>
        <br/>
        <label>
        Адресс
        <br/>
        <input type="text" value={elem.address} onChange={(e)=>{this.handleChange(e,"address")}} />
        </label>
        <p/>
        {
          this.state.update?
               <button onClick={()=>this.UpdateElement(elem)}> Изменить </button>
              :<button onClick={()=>this.AddElement(elem)}>    Добавить</button>
        }
        <button onClick={()=>this.clear()}>Обнулить</button>
      </div>
    );
  }
}


class EditBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elem:{id:-1,name:"",surName:"",lastName:""},
      baseId:-1,
      update:false,
      root:props.root,
      firms:[],
      comboValue:{},
    }
  }

  clear(){
    this.state.baseId--;
    var elem=this.state.elem;
    for(var q in elem)
         elem[q]="";
     elem['id']=this.state.baseId;   
     this.setState({elem:elem})
  }  
  gfirm = async () => {
    var result= await API.Func.GetFirm()
    var list=[]
    for(var q=0;q<result.length;q++) 
        list.push({value:result[q].fid,label:result[q].name})
    this.setState({firms:list});
  } 

  componentDidMount() {
    this.gfirm();
  }
  
  AddElement(elem){
    var T=this;
    async function add(){
      var res= await API.Func.AddEmploye(elem);
      if (res!=null&&res.createdId>0)
      {
        elem.id=res.createdId;
        T.props.root.AddEmploye({ ...elem})
        T.clear();   
      }
    }
    add();
  } 
  UpdateElement(elem,_state){
    var T=this;
    let firmName=this.state.comboValue;
    async function update(){
      var res= await API.Func.UpdateEmploye(elem);
      if (res!=null&&res.createdId>0)
      {
        
        elem.id=res.createdId;
        let newElem={ ...elem};
        newElem.firmName=firmName.label; 
        T.props.root.UpdateWorker(newElem)
      }
    }
    update();
  } 

  
  componentDidUpdate(ee){
    let localWorker=this.state.elem;
    let currentWorker=ee.root.state.currentWorker;
    if (currentWorker.id===localWorker.id)   return;
    
    let comboV=this.state.firms.find(x=>x.value==currentWorker.fid)
    this.setState({elem:currentWorker,update:true,comboValue:comboV});
  }

  handleChange(event,fName) {
    let a=this.state.elem;
    a[fName]=event.target.value;
    this.setState({elem:a});
  }
  changeFid(e){
    let elem=this.state.elem;
    elem.fid=e.value;
    let comboV=this.state.firms.find(x=>x.value==elem.fid)

    console.log('comboV',comboV,e,elem,this.state.firms)

    this.setState({elem:elem,comboValue:comboV});
    
    
    console.log(this.state)
  }

  
  render()
     {
       const E=this.state.elem;
       const T=this;
    return (
      <div className ="mainBlock">
        <span>id</span>
        <br/>
        <input value={E.id} readOnly className="deactive" ></input>
        <br/>
        <label>
        Фамилия
        <br/>
        <input type="text" value={E.surName} onChange={(e)=>{this.handleChange(e,"surName")}} />
        </label>
        <br/>
        <label>
        Имя
        <br/>
        <input type="text" value={E.name} onChange={(e)=>{this.handleChange(e,"name")}} />
        </label>
        <br/>
        <label>
        Отчество
        <br/>
        <input type="text" value={E.lastName} onChange={(e)=>{this.handleChange(e,"lastName")}} />
        </label>
        <p/>
        Фирма
        <Select className='width200' onChange={(e)=>{this.changeFid(e) }} options={this.state.firms}  value={this.state.comboValue}  />
        <br></br>
        {
          this.state.update?
               <button onClick={()=>this.UpdateElement(E,T)}> Изменить </button>
              :<button onClick={()=>this.AddElement(E)}>    Добавить</button>
        }
        <button onClick={()=>this.clear()}>Очистить форму</button>
      </div>
    );
  }
}

class MainBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workers: [],
      firms: [],
      currentFirm:{fid:-1,name:"",inn:"",address:""},
      currentWorker:{id:-1,surName:"",name:"",lastName:"",address:"",firmName:""},
      showTimer:true,
      dataLoaded:false
    };
  }

  AddEmploye(emp){
    var workers=this.state.workers.slice()
    workers.push(emp)
    this.setState({workers: workers})
  }
  AddFirm(newFirm){
    var f=this.state.firms.slice()
    f.push(newFirm)
    this.setState({firms: f})
  }
  UpdateFirm(newFirm){
    
    var f=this.state.firms.find(x=>x.fid==newFirm.fid)
    this.state.firms[f]=newFirm;
    this.setState({firms: this.state.firms})
  }

  UpdateWorker(worker){

    //*****************************//
    var f=this.state.workers.find(x=>x.id==worker.id)
    f.firmName=worker.firmName;
    this.state.workers[f]=worker;
    this.setState({workers: this.state.workers})
  }
 

  componentDidMount() {
    async function call(_this)
    {
      _this.setState({workers:await API.Func.GetEmploye(),dataLoaded:true })
      _this.setState({firms:await API.Func.GetFirm(),dataLoaded:true })
    };
    call(this);
  }
    editFirm(firm){
       this.setState({currentFirm:firm});
    }
    editWorker(worker){
      this.setState({currentWorker:worker});
   }
    render() {

    const THIS=this;
    const listItems = this.state.workers.map((number) =>
    <li key={number.id}>
          <div className='spanwidth150'>{number.surName}</div>
          <div className='spanwidth150'>{number.name}</div>
          <div className='spanwidth150'>{number.firmName}</div>
          <button onClick={()=>{THIS.editWorker(number)}}>edit</button>
    </li>
    );


    const firmItems = this.state.firms.map((number) =>
    <li key={number.fid}>
          <div className='spanwidth150'>{number.name}</div>
          <div className='spanwidth150'>{number.inn}</div>
          <div className='spanwidth150'>{number.address}</div>
          <button onClick={()=>{THIS.editFirm(number)}}>edit</button>
    </li>
    );
/**/
   

    return (
      <div className="dataBlock">
        <div className="dataBlock">
          {
            <EditBox root={this} />
          }
          Список сотрудников
          <div className='header' >
            <div className='spanwidth150'>Фамилия</div>
            <div className='spanwidth150'>Имя</div>
          </div>
            <ol>{listItems}</ol>
        </div>

        <div className="dataBlock dataBlockLeft">
          <FirmBox root={this} curFirm={this.state.currentFirm} ></FirmBox>
          Список фирм
          <div className='header' >
            <div className='spanwidth150'>Название</div>
            <div className='spanwidth150'>Инн</div>
            <div className='spanwidth150'>Адресс</div>
          </div>
          <ol>{firmItems}</ol>
        </div>

      </div>

    );
  }
}

// ========================================

ReactDOM.render(<MainBoard />, document.getElementById("root"));










