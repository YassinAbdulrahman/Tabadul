import renderer from "react-test-renderer";

import ListedItems from "../ListedItems";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            pathname: "",
            // ... whatever else you you call on `router`
        };
    },
}));

it("renders correctly", () => {
    const tree = renderer.create(<ListedItems />).toJSON();
    expect(tree).toMatchSnapshot();
});
