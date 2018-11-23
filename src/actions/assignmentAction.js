import * as types from './action_types.js';
import { connect } from 'react-redux'
import axios from 'axios';
import {subjects} from '../fakeData.js';
import {API_URL} from '../config/config';
import moment from 'moment'



/**
 *  RETRIEVAL API CALLS
 */
 export const retrieveTasks = (data) => {
   return (dispatch) => {
     return axios.get(API_URL + '/Subjects/getAll/' + data)
     .then( response => {
         if (response.data === "failed")
         {
           alert("Failed to retrieve name")
         }
         else {
           dispatch(initializeTasks(response.data))
         }
     })
     .catch(error => {
       alert("Failed to retrieve name. If this error persists, contact and administrator")
     })
   }
 }

 export const retrieveOverdueTasks = (user_id) => {
   return (dispatch) => {
     return axios.get(API_URL + '/Tasks/getOverdueTasks/' + user_id)
     .then( response => {
         if (response.data === "failed") {
           alert("Failed to retrieve overdue assignments")
         }
         else {
           dispatch(setOverdueTasks(response.data))
         }
     })
     .catch(error => {
       alert("Failed to retrieve overdue assignments. If this error persists, contact and administrator")
     })
   }
 }

 export const retrieveCompletedTasks = (user_id) => {
   return (dispatch) => {
     return axios.get(API_URL + '/Tasks/viewCompletedTasks/' + user_id)
     .then( response => {
         if (response.data === "failed") {
           alert("Failed to retrieve completed assignments")
         }
         else {
           dispatch(setCompletedTasks(response.data))
         }
     })
     .catch(error => {
       alert("Failed to retrieve completed assignments. If this error persists, contact and administrator")
     })
   }
 }


 /**
  *  SUBJECT API CALLS
  */


 export const newSubject = (name, color, description, primary_type, user_id) => {
   let params = {
     name:name,
     color:color,
     description:description,
     primary_type:primary_type,
     user_id : user_id,
   }
   console.log(params)
   return (dispatch) => {
     return axios.post(API_URL + '/Subjects/addSubject',params)
     .then( response => {
       if (response.data === "failed") {
         alert("Adding failed")
       }
       else {
         let newSubject;
         //Can modify once api only returns a single new subject object
         let s = response.data;
         console.log(s);
         if(typeof s === Array) {
          s.map((subject) => {
            if(subject.name === name)
              newSubject = subject;
          })
         } else if(typeof s === Object) {
          newSubject = s;
         }
         //Can modify once api only returns a single new subject object
         if(newSubject)
          dispatch(addSubject(newSubject))
       }
     })
     .catch(error => {
       alert("Server error")
     })
   }
 }

 export const editSubject = (newSubject) => {
   let params = {
     subject_id:newSubject.subject_id,
     name:newSubject.name,
     color:newSubject.color,
     default_task_type:newSubject.default_task_type
   };
   return (dispatch) => {
     return axios.post(API_URL+'/Subjects/updateSubjectName/', params)
     .then( response => {
       let newS;
       //DELETE AFTER API CALL IS UPDATED TO RETURN ONE SUBJECT
       let s = response.data;
       s.map((subject) => {
         if(subject.subject_id === newSubject.subject_id)
           newSubject = subject;
       })
       //DELETE AFTER API CALL IS UPDATED TO RETURN ONE SUBJECT
       if(newS)
        dispatch(updateSubject(newS))
     })
     .catch(error => {
       alert("Fail to create new subject at this time. If the persists, contact administrator")
     })
   }
 }

 export const deleteSubject = (subject) => {
   let params = {subject_id:subject.subject_id}
   return (dispatch) => {
     return axios.delete(API_URL+'/Subjects/deleteSubject/'+params.subject_id)
     .then( response => {

      if(response.status === 200 && response.data != 'failed')
       dispatch(removeSubject(subject.subject_id))

     })
     .catch(error => {
       alert("Fail to delete subject")
     })
   }
 }


/**
 *  TASK API CALLS
 */


export const newTask = (name,description,type,dueDate, subject_id, user_id) => {
  let params = {
      name:name,
      description:description,
      type:type,
      dueDate:dueDate,
      subject_id : subject_id,
      user_id : user_id
  }

  return (dispatch) => {
    return axios.post(API_URL + '/Tasks/addA',params)
    .then( response => {
      let s = response.data;
      //Can delete once api returns new assignment
      let newTask;
      s.map((subject) => {
        if(subject.subject_id === subject_id)
          subject.assignments.map((a) => {
            if(a.name === name && moment(a.dueDate).isSame(moment(dueDate)))
              newTask = a;
          })
      })
      //Can delete once api returns new assignment
      if(newTask && subject_id)
        dispatch(addTask(newTask, subject_id))
    })
    .catch(error => {
      alert("Fail to create new assignment")
    })
  }
}

export const editTask = (task, subject_id, user_id) => {
  let params = {
    name:task.name,
    description:task.description,
    type:task.type,
    dueDate:task.dueDate,
    task_id:task.task_id,
    subject_id:subject_id,
    user_id:user_id,
  }
  return (dispatch) => {
    return axios.post(API_URL + '/Tasks/updateA',params)
    .then( response => {
      console.log(response)
      dispatch(updateTask(response.data))
    })
    .catch(error => {
      alert("Failed to edit assignment")
    })
  }
}

export const deleteTask = (task) => {
  let params = {task_id:task.task_id}

  return (dispatch) => {
    return axios.delete(API_URL + '/Tasks/deleteTask/'+params.task_id)
    .then( response => {
      if(response.status === 200 && response.data != 'failed')
        dispatch(removeTask(task.task_id))
    })
    .catch(error => {
      alert("Failed to delete task")
    })
  }
}

export const completeTask = (task)  => {
  
  let params = {
    task_id:task.task_id
  }
  return (dispatch) => {
    return axios.post(API_URL+'/Tasks/setCompleted', params)
    .then( response => {
      if(response.status === 200 && response.data != 'failed')
        dispatch(removeTask(task.task_id))
    })
    .catch(error => {
      alert("Failed to complete task");
    })
  }
}






/**
 *  ACTIONS THAT MODIFY STATE
 */



/*Retrival actions*/
export const initializeTasks = (data) => {
  return {
    type: types.INITIALIZE_ASSIGNMENTS,
    payload: {
      subjects : data,
    }
  }
}

export const setOverdueTasks = (assignments) => {
  return {
    type: types.SET_OVERDUE_ASSIGNMENTS,
    payload: {
      assignments : assignments,
    }
  }
}

export const setCompletedTasks = (assignments) => {
  return {
    type: types.SET_COMPLETED_ASSIGNMENTS,
    payload: {
      assignments : assignments,
    }
  }
}
/*Retrival actions*/

/*Subject actions*/
export const updateSubject = (subject) => {
  return {
    type: types.UPDATE_SUBJECT,
    payload : {
      subject : subject,
    }
  }
}

export const removeSubject = (subject_id) => {
  return {
    type: types.DELETE_SUBJECT,
    payload : {
      subject_id : subject_id,
    }
  }
}

export const addSubject = (subject) => {
  return {
    type: types.ADD_SUBJECT,
    payload : {
      subject : subject,
    }
  }
}
/*Subject actions*/

/*Task actions*/
export const addTask = (assignment, subject_id) => {
  return {
    type: types.ADD_ASSIGNMENT,
    payload : {
      assignment : assignment,
      subject_id: subject_id
    }
  }
}

export const updateTask = (assignment) => {
    return {
      type : types.UPDATE_ASSIGNMENT,
      assignment: assignment
    }
}

export const removeTask = (task_id, subject_id) => {
  return {
    type: types.DELETE_TASK,
    payload : {
      task_id:task_id,
      subject_id:subject_id
    }
  }
}
/*Task actions*/




