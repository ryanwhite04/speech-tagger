import React from 'react'
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

/**
 * A basic vertical non-linear implementation
 */

export default ({
  step = 0,
  open = false,
  close,
  setStep,
  steps = [],
}) => {

  const renderStepActions = () => <div style={{margin: '12px 0'}}>
    <RaisedButton
      label="Next"
      disableTouchRipple={true}
      disableFocusRipple={true}
      primary={true}
      onClick={setStep(step + 1, steps.length)}
      style={{marginRight: 12}}
    />
    {step > 0 && (
      <FlatButton
        label="Back"
        disableTouchRipple={true}
        disableFocusRipple={true}
        onClick={setStep(step - 1, steps.length)}
      />
    )}
  </div>

  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={close}
    />,
    // <FlatButton
    //   label="Submit"
    //   primary={true}
    //   keyboardFocused={true}
    //   onClick={handleClose}
    // />,
  ]

  return <Dialog
    title="How do I tag syllables?"
    actions={actions}
    modal={false}
    open={open}
    onRequestClose={close}
    autoScrollBodyContent={true}
  >
    <Stepper
      activeStep={step}
      linear={false}
      orientation="vertical"
    >
      {steps.map(({ label, content }, index) => (
        <Step key={index}>
          <StepButton onClick={setStep(index, steps.length)}>
            {label}
          </StepButton>
          <StepContent>
            {content}
            {renderStepActions()}
          </StepContent>
        </Step>
      ))}
    </Stepper>
  </Dialog>
}
