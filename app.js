function NewForm (props) {
  const [task, setTask] = React.useState('')

  function changeHandler (e) {
    setTask(e.target.value)
  }

  function submitHandler (e) {
    e.preventDefault()
    props.onAdd({ task: task, complete: false })
    setTask('')
  }

  return (
    <form onSubmit={submitHandler}>
      <input 
        type="text" 
        className="form-control py-3" 
        placeholder="Create a new todo..." 
        value={task}
        onChange={changeHandler} />
    </form>
  )
}

function ListItem (props) {
  const item = props.item
  
  function changeHandler () {
    props.onUpdateItem(item)
  } 

  function clickHandler () {
    props.onDeleteItem(item)
  }

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="flex-fill">
        <input  type="checkbox"
                className="form-check-input me-2"  
                checked={item.complete}
                onChange={changeHandler} />
        <span>{item.task}</span>
      </div>
      
      <button className="btn text-black-50" onClick={clickHandler}>
        <i className="fas fa-times"></i>
      </button>
    </li>
  )
}

function RemainingItems (props) {
  return (
    <li className="list-group-item d-flex align-items-center py-3">
      <span className="text-black-50">Remaining items: {props.remaining}</span>
    </li>
  )
}

function List (props) {
  const list = props.list.map((item, id) => ({...item, id}))
  const remaining = list.filter(item => !item.complete).length
  
  function onUpdateItemHandler (updated) {
    props.onUpdate(list.map(item => 
      item.id === updated.id ? {...item, complete: !item.complete } : item))
  }
  
  function onDeleteItemHandler (deleted) {
    props.onDelete(list.filter(item => item.id !== deleted.id))
  }

  return (
    <ul className="list-group mt-3">
      {list.map(item => 
        <ListItem 
          key={item.id} 
          item={item} 
          onUpdateItem={onUpdateItemHandler}
          onDeleteItem={onDeleteItemHandler}
        />)}
      <RemainingItems remaining={remaining} />
    </ul>
  )
}

function App () {
  const initialList = [
    { task: 'Buy Milk', complete: false },
    { task: 'Feed Cat', complete: true }
  ]
  
  const [list, setList] = React.useState(() => 
    JSON.parse(localStorage.getItem('list')) || initialList 
  )

  function onUpdateHandler (list) {
    setList(list)
  }

  function onDeleteHandler (list) {
    setList(list)
  }

  function onAddHandler (item) {
    setList([...list, item])
  }

  React.useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [JSON.stringify(list)])
 
  return (
    <div className="row justify-content-center">
      <div className="col col-md-6">
        <h1 className="display-4 my-5">To Do List </h1>
        <NewForm onAdd={onAddHandler} />
        <List list={list} onUpdate={onUpdateHandler} onDelete={onDeleteHandler} />
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)