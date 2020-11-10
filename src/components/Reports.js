

export default function Report() { 
  const [reports, setReports] = setState([]); 

  return (
    <div>
      <h1> Reports </h1>
      <div>
        {
          reports.map((data) => {
            return (
              <div>
                
              </div>
            )
          })
        }
      </div>
    </div>
  )
}