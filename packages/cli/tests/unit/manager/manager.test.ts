import { CLI } from "../../../src/cli";
import { IComponentManager } from "../../../src/types/manager";

describe("Manager", () => {
  it("should call installComponent on the ComponentManager when adding a component", async () => {
    const mockComponentManager: IComponentManager = {
      installComponent: jest.fn(),
      uninstallComponent: jest.fn(),
      listInstalledComponents: jest.fn(),
      updateComponent: jest.fn(),
    };

    const cli = new CLI();
    await cli.run(["node", "fetch-ui", "add", "button"]);

    expect(mockComponentManager.installComponent).toHaveBeenCalledWith(
      "button",
      undefined
    );
  });
});
