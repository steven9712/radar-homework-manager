import React from 'react';
import { connect } from 'react-redux';
import { retrieveAssignments, addSubject } from '../actions/assignmentAction.js';

const mapDispatchToProps = dispatch => ({
 retrieveAssignments: () => dispatch(retrieveAssignments()),
 addSubject: (subject) => dispatch(addSubject(subject))
})

const mapStateToProps = state => {
    console.log("Map :"+ JSON.stringify(state));
    return {
      /* map this later
      name:"",
      color:"",
      assignments:[],
      */
    }
  }

export class SubjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    //alert('The following Subject was submitted: ' + this.state.subjectName);
    let colors = ['red','blue','green','orange','black','magenta','maroon','cyan'];
    let index = Math.floor(Math.random() * colors.length);
    let color = colors[index];


    this.props.addSubject(
      {name:this.state.subjectName, color:color, assignments:[], description:this.state.subjectDesc, defaultType:this.state.defaultTaskType});

    this.setState(this.getDefaultState())
  }

  getDefaultState() {
    return {subjectName:'', subjectDesc:'', defaultTaskType: 'Assignment'};
  }

  render() {

    let taskTypeOptions = [];
    for (let i = 0; i < this.props.taskTypes.length; ++i)
    {
      const taskType = this.props.taskTypes[i];
      taskTypeOptions.push(<option value={taskType}>{taskType}</option>);
    }

    return (
      <form >
        <b>Add Subject</b>
        <br/>
        <label>
          Subject Name:
          <input name="subjectName" type="text" value={this.state.subjectName} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Subject Description:
          <input name="subjectDesc" type="text" value={this.state.subjectDesc} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Default Task Type:
          <select name="defaultTaskType" onChange={this.handleChange}>
            {taskTypeOptions}
          </select>
        </label>
        <br />
        <button type="button" value="Submit" onClick={this.handleSubmit}>Submit</button>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubjectForm);
