import { Field } from "formik";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
} from "@material-ui/core";

import FormikSlider from "components/molecules/fields/FormikSlider";

const marks = [
  { value: 3, label: "3s" },
  { value: 10, label: "10s" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
];

function getAriaValueText(value: number) {
  return `${value} seconds`;
}

function getValueLabelFormat(value: number) {
  return `${value}s`;
}

export default function SlideDurationField() {
  return (
    <FormControl fullWidth>
      <FormLabel id="slide-duration">Slide Duration</FormLabel>
      <Grid container spacing={2}>
        <Grid item xs>
          <Field
            name="slideDuration"
            aria-labelledby="slide-duration"
            getAriaValueText={getAriaValueText}
            valueLabelFormat={getValueLabelFormat}
            component={FormikSlider}
            marks={marks}
            min={3}
            max={60}
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>
      <FormHelperText>
        The length of time it takes to transition between pictures.
      </FormHelperText>
    </FormControl>
  );
}
