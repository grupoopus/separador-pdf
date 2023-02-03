import { Subtitle1, Title1, makeStyles } from '@fluentui/react-components';
import Input from './Components/Input';

const styles = makeStyles({
  root: {
    display: 'flex',
  },
})

function App() {
  return (
    <div>
      <div className={styles.root}></div>
      <Title1 align="center">Divisor PDF</Title1>
      {Input()}
    </div >
  );
}

export default App;
