import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";
import { AppProvider } from "../src/app/AppContext";

function AllProviders({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
