import React from "react";
import preloadAll from "jest-next-dynamic";
import renderer from "react-test-renderer";
import { AppBarTest } from "../../stories/AppBar.stories";
import { I18nProviderWrapper } from "../i18n";
import { ConfigProvider } from "../contexts/config";
import { BootstrapInfoProvider } from "contexts/bootstrap";
import { RQWrapper } from "../__mocks__/RQWrapper";
beforeAll(async () => {
    await preloadAll();
});

test("App Bar renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <BootstrapInfoProvider>
                    <ConfigProvider>
                        <AppBarTest />
                    </ConfigProvider>
                </BootstrapInfoProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
