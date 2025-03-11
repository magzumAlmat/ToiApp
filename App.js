import { Provider } from 'react-redux';
import { store } from './src/store/store';
import Navigation from './src/navigation/index';
import { ThemeProvider } from 'react-native-magnus';
export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
      <Navigation />
      </ThemeProvider>
    </Provider>
  );
}



