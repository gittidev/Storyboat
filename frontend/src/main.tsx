import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import reportWebVitals from './reportWebVitals.tsx'
// import { ReactFlowProvider } from 'reactflow';
import { RecoilRoot } from 'recoil';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
      {/* <ReactFlowProvider> */}
        <App />
      {/* </ReactFlowProvider> */}
    </RecoilRoot> 

)
reportWebVitals();


