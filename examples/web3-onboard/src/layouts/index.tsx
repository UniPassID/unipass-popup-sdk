import { Outlet } from "umi";
import { Web3OnboardProvider } from "@web3-onboard/react";
import styles from "./index.less";
import web3Onboard from "../unipass/web3-onboard";

export default function Layout() {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <div className={styles.navs}>
        <Outlet />
      </div>
    </Web3OnboardProvider>
  );
}
