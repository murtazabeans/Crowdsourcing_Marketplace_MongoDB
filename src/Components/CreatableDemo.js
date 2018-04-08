import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

var CreatableDemo = createClass({
	displayName: 'CreatableDemo',
	propTypes: {
		hint: PropTypes.string,
		label: PropTypes.string
	},
	getInitialState () {
		return {
			multi: true,
			multiValue: [],
			options: [],
			skills_data: [],
			value: undefined
		};
	},
	handleOnChange (value) {
		const { multi } = this.state;
		if (multi) {
			this.setState({ multiValue: value });

		} else {
			this.setState({ value });
		}
		let skills_arr = [];
		if(value != []){
			for(let i = 0; i < value.length; i++){
				skills_arr.push(value[i].value);
			}
			this.props.handleSkillsChange(skills_arr);
			this.setState({ skills_data: skills_arr });
		}
		else{ 
			this.setState({ skills_data: [] });
			this.props.handleSkillsChange(this.state.skills_data);
		}
	},
	render () {
		const { multi, multiValue, value, options } = this.state;
		return (
			<div className="section">
				<div className="validate-input m-b-26 div-space form-div" data-validate="Skills are required">
					<span className="label-input100">Skills</span>
					<Select.Creatable	multi={multi} options={options}	onChange={this.handleOnChange} value={multi ? multiValue : value}/>
					<div className="hint">{this.props.hint}</div>
										
				</div>
			</div>
		);
	}
});

export default CreatableDemo;