import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepButton, ThemeProvider, createTheme } from '@mui/material';
import * as Actions from "../../../../../state/Actions"
// import makeStyles from "@mui/styles/makeStyles";

// const useStyles = makeStyles(() => ({
//     step_label_root: {
//         fontSize: '14px',
//         fontFamily: "Noto Sans"
//     }
// }));

const steps = ['Upload File', 'Create/Choose Mapping', 'Save'];

export default function HorizontalLinearStepper() {
    // const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const state = Actions.getState(React.useContext)
    const dispatch = Actions.getDispatch(React.useContext)
    const { activeStep } = state
    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };
    const onStepClick = (index) => {
        if (index !== activeStep) {
            if (index == 0) {
              Actions.resetFileImports(dispatch)
            } else {
                dispatch(Actions.stateChange("activeStep", index))
            }
        }
    }
    
    const theme = createTheme({
        components: {
            // Name of the component ⚛️

            MuiStepper: {
                defaultProps: {
                    style: { outline: 0, }
                }
            },
            MuiStepButton: {
                defaultProps: {
                    style: { outline: 0 },
                }
            }
        },
    });


    return (
        <Box maxWidth={"400"} sx={{ pt: 2 }}>
            <ThemeProvider theme={theme}>
                <Stepper activeStep={activeStep} >
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};

                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepButton color="inherit" sx={{
                                    color: "red !important",
                                    ".MuiStepButton-root": {
                                        backgroundColor: 'red',

                                    },
                                }} onClick={() => onStepClick(index)}>
                                    <StepLabel sx={{}}>
                                        {label}
                                    </StepLabel>
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>
            </ThemeProvider>
        </Box>
    );
}