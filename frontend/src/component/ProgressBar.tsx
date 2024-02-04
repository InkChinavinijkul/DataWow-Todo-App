/**
 * use position relative and absolute for the progress bar
 * not entirely sure how to deal with responsive alignment in pure css here
 * could (should) probably use flexbox or grid...
 */

interface IProgressBarProps {
  progress: number
  total: number
}

const ProgressBar = (props: IProgressBarProps) => {
  const { progress, total } = props
  return (
    <div
      style={{
        width: "100%",
        color: "white",
        height: "123px",
        backgroundColor: "#E07C7C",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "20px",
        justifyContent: "space-between"
      }}
    >
      <div style={{ fontSize: "28px" }}>Progress</div>
      <div
        style={{
          backgroundColor: "#3B3B3B",
          position: "relative",
          width: "100%",
          alignSelf: "center",
          height: "7.34px",
          borderRadius: "999px"
        }}
      >
        <div
          style={{
            position: "absolute",
            backgroundColor: "white",
            borderRadius: "999px",
            top: 0,
            left: 0,
            width: `${(100 * progress) / total}%`,
            height: "100%"
          }}
        />
      </div>
      <div style={{ fontSize: "16px" }}>{`${progress}/${total} completed`}</div>
    </div>
  )
}

export default ProgressBar
