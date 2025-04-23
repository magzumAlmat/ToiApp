import { Provider } from 'react-redux';
import { store } from './src/store/store';
import Navigation from './src/navigation/index';
import { PaperProvider } from 'react-native-paper';
export default function App() {
  
  return (
    <Provider store={store}>
       <PaperProvider>

      <Navigation />
    
    
      </PaperProvider>
    </Provider>
  );
}



