import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../../assets/Loader.json";

const PendingTripLoader = () => {
  return (
    <div style={styles.container}>
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};

export default PendingTripLoader;
