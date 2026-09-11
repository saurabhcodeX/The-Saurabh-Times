// import { useEffect, useState } from "react";

// export default function PageLoader() {
//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);

//           setTimeout(() => {
//             setLoading(false);
//           }, 400);

//           return 100;
//         }

//         return prev + 4;
//       });
//     }, 35);

//     return () => clearInterval(interval);
//   }, []);

//   if (!loading) return null;

//   return (
//     <div className="page-loader">
//       <div className="loader-top">
//         <span>PORTFOLIO</span>
//         <span>2026</span>
//       </div>

//       <div className="loader-center">
//         <p>SAURABH</p>
//         <h1>CREATIVE<br />DEVELOPER</h1>
//       </div>

//       <div className="loader-bottom">
//         <span>LOADING</span>

//         <div className="loader-progress">
//           <div
//             className="loader-progress-bar"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         <span>{progress}%</span>
//       </div>
//     </div>
//   );
// }