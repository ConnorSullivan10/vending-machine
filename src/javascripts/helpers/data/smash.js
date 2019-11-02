import machineData from './machineData';
import positionData from './positionData';
import snackPositionData from './snackPositionData';
import snackData from './snackData';

const getCompleteMachine = () => new Promise((resolve, reject) => {
  // 1. getMachines - returns first machine (hard coding)
  // 2. use MachineId to get all positions for that machine
  // 3. use MachineId to get all snack positions
  // 4. use uid of snackPositions/positions to get availabls snacks for that machine
  // 5. SMASH EM' - return an array of positions (in order A1, A2, A3, B1 ....)
  // so positions should have position.snack if a snack exists at that position
  machineData.getMachine()
    .then((singleMachine) => positionData.getAllPositionsByMachineId(singleMachine.id))
    .then((positions) => {
      snackPositionData.getAllSnackPositionsByMachineId(positions[0].machineId)
        .then((snackPositions) => {
          snackData.getSnacksByUid(positions[0].uid).then((snacks) => {
            const newPositions = [];
            positions.forEach((position) => {
              const newP = { ...position };
              const getSnackPosition = snackPositions.find((x) => x.positionId === newP.id);
              if (getSnackPosition) {
                const snack = snacks.find((x) => x.id === getSnackPosition.snackId);
                newP.snack = snack;
              } else {
                newP.snack = {};
              }
              newPositions.push(newP);
            });
            // order positions A1, A2, A3, B1, B2, B3, C1, C2, C3
            const sortedPositions = positions.sort((a, b) => a.position.localeCompare(b.position, 'en', { numeric: true }));
            resolve(sortedPositions);
          });
        });
    })
    .catch((error) => reject(error));
});

export default { getCompleteMachine };
