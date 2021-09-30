import { Box, Button, Paper } from "@material-ui/core";
import NodeRow from "components/templates/NodeRow";
import BackToConfigButton from "components/molecules/buttons/BackToConfigButton";

export type SoloGameCardProps = {
  onStart: () => void;
};

export default function SoloGameCard({ onStart }: SoloGameCardProps) {
  return (
    <Paper>
      <Box p={2}>
        <NodeRow>
          <Button onClick={onStart} variant="contained" color="primary">
            start game
          </Button>
          <BackToConfigButton />
        </NodeRow>
      </Box>
    </Paper>
  );
}
