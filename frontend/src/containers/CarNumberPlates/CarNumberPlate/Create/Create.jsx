import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { createInit, create } from "../../../../store/actions/index";
import WithErrorHandler from '../../../../hoc/WithErrorHandler/WithErrorHandler';
import Aux from '../../../../hoc/Aux';
import CarPlateNumberForm from "../../../../components/CarPlateNumbers/CarPlateNumber/Form/CarPlateNumberForm";
import Button from "../../../../components/UI/Form/Button/Button";

class Create extends Component {
  constructor( props ) {
    super(props);
    this.state = {
      inputs: {
        firstName: {
          value: '',
          label: 'First name',
          placeholder: 'Owners first name...',
          required: true,
          error: '',
        },
        lastName: {
          value: '',
          label: 'Last name',
          placeholder: 'Owners last name...',
          required: true,
          error: '',
        },
        number: {
          value: '',
          label: 'number on car plate',
          placeholder: 'Car plate number...',
          required: true,
          error: '',
        },
      }
    };
    this.inputChangedHandler = event => {
      const value = event.target.value.toUpperCase();
      const name = event.target.name;
      const updatedState = { ...this.state };
      const updatedInputs = { ...updatedState.inputs };
      const updatedInput = { ...updatedInputs[ name ] };
      updatedInput.value = value;
      updatedInput.error = '';
      updatedInputs[ name ] = updatedInput;
      this.setState({ inputs: updatedInputs });
    };
    this.formSubmitHandler = event => {
      event.preventDefault();
      const carNumberPlate = {
        number: this.state.inputs.number.value,
        owner: {
          firstName: this.state.inputs.firstName.value,
          lastName: this.state.inputs.lastName.value
        }
      };
      this.props.onCreate(carNumberPlate);
    };
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    let newState = null;
    if ( nextProps.error && nextProps.error.code === 422 ) {
      const errors = nextProps.error.errors;
      const updatedState = { ...prevState };
      const updatedInputs = { ...updatedState.inputs };
      errors.forEach(e => {
        const updatedInput = { ...updatedInputs[ e.key ] };
        updatedInput.error = e.message;
        updatedInputs[ e.key ] = updatedInput;
      });
      newState = { inputs: updatedInputs };
    }
    return newState;
  }

  componentWillUnmount() {
    this.props.onInit();
  }

  render() {
    let content = <Redirect to="/car-number-plates"/>;
    if ( !this.props.created ) {
      content = (
        <Aux>
          <h2 style={{ textTransform: 'uppercase', textAlign: 'center' }}>create new car number plate</h2>
          <CarPlateNumberForm submitted={this.formSubmitHandler}
                              inputs={this.state.inputs}
                              inputChanged={this.inputChangedHandler}>
            <div style={{ textAlign: 'center' }}>
              <Button buttonType="submit" buttonClass="primary" disabled={this.props.creating}>
                Create
              </Button>
            </div>
          </CarPlateNumberForm>
        </Aux>
      );
    }
    return <Aux>{content}</Aux>;
  }
}

const mapStateToProps = state => ({
  creating: state.create.creating,
  created: state.create.created,
  error: state.create.error,
});

const mapDispatchToProps = dispatch => ({
  onInit: () => dispatch(createInit()),
  onCreate: cnp => dispatch(create(cnp))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandler(Create));