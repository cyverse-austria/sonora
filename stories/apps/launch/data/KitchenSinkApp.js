export default {
    description: "everything but deprecated params",
    requirements: [
        {
            step_number: 0,
            default_memory: 2147483648,
            default_disk_space: 1073741824,
            default_cpu_cores: 1,
        },
    ],
    deleted: false,
    disabled: false,
    name: "kitchen sink",
    system_id: "de",
    debug: false,
    label: "kitchen sink",
    id: "1778b1d6-5a83-11ea-9e38-008cfa5ae621",
    app_type: "DE",
    version: "v2",
    version_id: "b9e1e332-0d34-11ed-ab8a-62d47aced14b",
    versions: [
        { version: "v2", version_id: "b9e1e332-0d34-11ed-ab8a-62d47aced14b" },
        { version: "v1", version_id: "8a1e3b3c-0d34-11ed-8b77-62d47aced14b" },
    ],
    groups: [
        {
            id: "177a671a-5a83-11ea-9e38-008cfa5ae621",
            name: "",
            label: "Files/Folders",
            parameters: [
                {
                    description: "not required, excluded if empty",
                    arguments: [],
                    name: "",
                    value: {
                        path: "/iplant/home/psarando/demo.txt",
                    },
                    type: "FileInput",
                    validators: [],
                    label: "Input File Label",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_177aaf4a-5a83-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        path: "/iplant/home/psarando/demo.txt",
                    },
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    value: {
                        path: "/iplant/home/psarando/ecoli",
                    },
                    type: "FolderInput",
                    validators: [],
                    label: "Input Folder",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_177c4440-5a83-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        path: "/iplant/home/psarando/ecoli",
                    },
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "--input",
                    value: {
                        path: [
                            "/iplant/home/psarando/ghetto_IM.txt",
                            "/iplant/home/psarando/demo.txt",
                        ],
                    },
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Multiple Input Files",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_177cd7b6-5a83-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        path: [
                            "/iplant/home/psarando/ghetto_IM.txt",
                            "/iplant/home/psarando/demo.txt",
                        ],
                    },
                    required: false,
                },
            ],
            step_number: 0,
        },
        {
            id: "177d4ae8-5a83-11ea-9e38-008cfa5ae621",
            name: "",
            label: "Text/Numerical Input",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label: "<h4>Info Text!</h4>\nDoes <b>HTML</b> display?\n:sparkles: `Markdown` **now** _supported_ :tada:",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_177d78f6-5a83-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "single line text",
                    arguments: [],
                    name: "--text",
                    value: "defaultxt",
                    type: "Text",
                    validators: [
                        {
                            type: "Regex",
                            params: ["[a-zA-Z]+"],
                        },
                        {
                            type: "CharacterLimit",
                            params: [10],
                        },
                    ],
                    label: "Single-line Text",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_8a4cf0fa-5a83-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "defaultxt",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    value: "multi\nline\ntext",
                    type: "MultiLineText",
                    validators: [],
                    label: "Multi-line Text",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_81301b9e-5a85-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "multi\nline\ntext",
                    required: false,
                },
                {
                    description: "checked t/f",
                    arguments: [],
                    name: "--checked true, --checked false",
                    value: true,
                    type: "Flag",
                    validators: [],
                    label: "Checkbox",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_813057d0-5a85-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "--checked, --unchecked",
                    value: true,
                    type: "Flag",
                    validators: [],
                    label: "Checkbox args without values",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_931784bc-5a91-11ea-bde0-008cfa5ae621",
                    isVisible: true,
                    defaultValue: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "--checked-only was checked, ",
                    value: true,
                    type: "Flag",
                    validators: [],
                    label: "Checkbox checked arg only",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d022466c-5a91-11ea-bcab-008cfa5ae621",
                    isVisible: true,
                    defaultValue: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: ", --unchecked-only was unchecked",
                    value: false,
                    type: "Flag",
                    validators: [],
                    label: "Checkbox unchecked arg only",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_eddfb202-5a91-11ea-bcab-008cfa5ae621",
                    isVisible: true,
                    defaultValue: false,
                    required: false,
                },
                {
                    description: "ENV VAR",
                    arguments: [],
                    name: "NEW_ENV_VAR",
                    value: "envvar",
                    type: "EnvironmentVariable",
                    validators: [],
                    label: "Environment Variable",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_58d5a140-5a86-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "envvar",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "--int",
                    value: 3,
                    type: "Integer",
                    validators: [
                        {
                            type: "IntRange",
                            params: [3, 7],
                        },
                        {
                            type: "IntAbove",
                            params: [1],
                        },
                        {
                            type: "IntBelow",
                            params: [10],
                        },
                    ],
                    label: "Integer with validations",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_58d5fa32-5a86-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: 3,
                    required: true,
                },
                {
                    description: "456",
                    arguments: [],
                    name: "-d",
                    value: 1.23,
                    type: "Double",
                    validators: [
                        {
                            type: "DoubleAbove",
                            params: [0],
                        },
                        {
                            type: "DoubleBelow",
                            params: [11],
                        },
                        {
                            type: "DoubleRange",
                            params: [0.01, 10.9],
                        },
                    ],
                    label: "Decimal with validation",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_a54462d2-5a86-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: 1.23,
                    required: true,
                },
            ],
            step_number: 0,
        },
        {
            id: "d7679d4c-5a86-11ea-9e38-008cfa5ae621",
            name: "",
            label: "Lists",
            parameters: [
                {
                    description: "required list",
                    arguments: [
                        {
                            name: "--required-list",
                            isDefault: false,
                            id: "abbe3acc-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 1",
                            value: "val1",
                        },
                        {
                            name: "--required-list",
                            isDefault: false,
                            id: "abbefbe2-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 2",
                            value: "val2",
                        },
                        {
                            name: "--required-list",
                            isDefault: false,
                            id: "abc0c332-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 3",
                            value: "val3",
                        },
                    ],
                    name: "",
                    value: {
                        isDefault: true,
                        display: "Value 3",
                        id: "abc0c332-5ce1-11ea-8af3-008cfa5ae621",
                        name: "--required-list",
                        value: "val3",
                    },
                    type: "TextSelection",
                    validators: [],
                    label: "Required Text List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_abbde28e-5ce1-11ea-8af3-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        isDefault: true,
                        display: "Value 3",
                        id: "abc0c332-5ce1-11ea-8af3-008cfa5ae621",
                        name: "--required-list",
                        value: "val3",
                    },
                    required: true,
                },
                {
                    description: "",
                    arguments: [
                        {
                            name: "--optional-list",
                            isDefault: false,
                            id: "e16d6f58-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 4",
                            value: "val4",
                        },
                        {
                            name: "--optional-list",
                            isDefault: false,
                            id: "e16d879a-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 5",
                            value: "val5",
                        },
                        {
                            name: "--optional-list",
                            isDefault: false,
                            id: "e16d9da2-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 6",
                            value: "val6",
                        },
                    ],
                    name: "",
                    type: "TextSelection",
                    validators: [],
                    label: "Optional List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_e16d4ad2-5ce1-11ea-8af3-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [
                        {
                            name: "--list-always",
                            isDefault: true,
                            id: "072d632e-5ce2-11ea-8af3-008cfa5ae621",
                            display: "only option",
                            value: "on",
                        },
                    ],
                    name: "",
                    value: {
                        isDefault: true,
                        display: "only option",
                        id: "072d632e-5ce2-11ea-8af3-008cfa5ae621",
                        name: "--list-always",
                        value: "on",
                    },
                    type: "TextSelection",
                    validators: [],
                    label: "Forced Option List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_072d3f52-5ce2-11ea-8af3-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        isDefault: true,
                        display: "only option",
                        id: "072d632e-5ce2-11ea-8af3-008cfa5ae621",
                        name: "--list-always",
                        value: "on",
                    },
                    required: true,
                },
                {
                    description: "",
                    arguments: [
                        {
                            name: "--int-list",
                            isDefault: false,
                            id: "e9dde8f6-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "1",
                            value: "Value 1",
                        },
                        {
                            name: "--int-list",
                            isDefault: true,
                            id: "e9de035e-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "2",
                            value: "Value 2",
                        },
                        {
                            name: "--int-list",
                            isDefault: false,
                            id: "e9de1a06-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "3",
                            value: "Value 3",
                        },
                    ],
                    name: "",
                    value: {
                        isDefault: true,
                        display: "3",
                        id: "e9de1a06-5ce2-11ea-aa6d-008cfa5ae621",
                        name: "--int-list",
                        value: "Value 3",
                    },
                    type: "IntegerSelection",
                    validators: [],
                    label: "Integer List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_e9ddc376-5ce2-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        isDefault: true,
                        display: "3",
                        id: "e9de1a06-5ce2-11ea-aa6d-008cfa5ae621",
                        name: "--int-list",
                        value: "Value 3",
                    },
                    required: false,
                },
                {
                    description: "",
                    arguments: [
                        {
                            name: "--decimal-list",
                            isDefault: false,
                            id: "e9de62fe-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "1.2",
                            value: "Value 1.2",
                        },
                        {
                            name: "--decimal-list",
                            isDefault: false,
                            id: "e9de7c4e-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "1.3",
                            value: "Value 1.3",
                        },
                        {
                            name: "--decimal-list",
                            isDefault: false,
                            id: "e9de917a-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "1.4",
                            value: "Value 1.4",
                        },
                    ],
                    name: "",
                    type: "DoubleSelection",
                    validators: [],
                    label: "Decimal List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_e9de4576-5ce2-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
            ],
            step_number: 0,
        },
        {
            id: "59f5c03c-5ce3-11ea-aa6d-008cfa5ae621",
            name: "",
            label: "Output",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "--out",
                    value: "tool.out",
                    type: "FileOutput",
                    validators: [],
                    label: "Output File by tool",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_59f5f372-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "tool.out",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "--folder-out",
                    value: "outputs",
                    type: "FolderOutput",
                    validators: [],
                    label: "Output Folder",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d128d8a6-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "outputs",
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "--multi-out",
                    value: "*.txt",
                    type: "MultiFileOutput",
                    validators: [],
                    label: "Multi-file Output",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d129746e-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "*.txt",
                    required: false,
                },
            ],
            step_number: 0,
        },
        {
            id: "d129ebce-5ce3-11ea-aa6d-008cfa5ae621",
            name: "",
            label: "Reference Genome",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "--ref-genome",
                    value: {
                        created_by: "<public>",
                        id: "e38b6fae-2e4b-4217-8c1f-6badea3ff7fc",
                        last_modified_by: "vaughn@iplantcollaborative.org",
                        name: "Canis lupus familiaris [Dog] (Ensembl 14_67)",
                        path: "/data2/collections/genomeservices/1.0.0/14_67/Canis_lupus_familiaris.CanFam_2.0/de_support/",
                        created_on: "1346948048000",
                        last_modified_on: "1378823110000",
                    },
                    type: "ReferenceGenome",
                    validators: [],
                    label: "Reference Genome",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d12a1af4-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        created_by: "<public>",
                        id: "e38b6fae-2e4b-4217-8c1f-6badea3ff7fc",
                        last_modified_by: "vaughn@iplantcollaborative.org",
                        name: "Canis lupus familiaris [Dog] (Ensembl 14_67)",
                        path: "/data2/collections/genomeservices/1.0.0/14_67/Canis_lupus_familiaris.CanFam_2.0/de_support/",
                        created_on: "1346948048000",
                        last_modified_on: "1378823110000",
                    },
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "--ref-seq",
                    value: {
                        created_by: "vaughn@iplantcollaborative.org",
                        id: "b7d3e1b7-e1f8-42cb-86b2-4f85e329e42a",
                        last_modified_by: "vaughn@iplantcollaborative.org",
                        name: "Theobroma cacao [Cocoa bean] (Phytozome 9.0)",
                        path: "/data2/collections/genomeservices/1.0.0/phytozome/9.0/Theobroma_cacao.Matina_1-6/de_support/",
                        created_on: "1382790214000",
                        last_modified_on: "1382790214000",
                    },
                    type: "ReferenceSequence",
                    validators: [],
                    label: "Reference Sequence",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d12a9a88-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        created_by: "vaughn@iplantcollaborative.org",
                        id: "b7d3e1b7-e1f8-42cb-86b2-4f85e329e42a",
                        last_modified_by: "vaughn@iplantcollaborative.org",
                        name: "Theobroma cacao [Cocoa bean] (Phytozome 9.0)",
                        path: "/data2/collections/genomeservices/1.0.0/phytozome/9.0/Theobroma_cacao.Matina_1-6/de_support/",
                        created_on: "1382790214000",
                        last_modified_on: "1382790214000",
                    },
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "--ref-annotation",
                    value: {
                        created_by: "<public>",
                        id: "41149e71-4328-4391-b1d2-25fdbdca5a54",
                        last_modified_by: "vaughn@iplantcollaborative.org",
                        name: "Felis catus [Domestic cat] (Ensembl 14_67)",
                        path: "/data2/collections/genomeservices/1.0.0/14_67/Felis_catus.CAT/de_support/",
                        created_on: "1346948048000",
                        last_modified_on: "1378823157000",
                    },
                    type: "ReferenceAnnotation",
                    validators: [],
                    label: "Reference Annotation",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d12b1f1c-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        created_by: "<public>",
                        id: "41149e71-4328-4391-b1d2-25fdbdca5a54",
                        last_modified_by: "vaughn@iplantcollaborative.org",
                        name: "Felis catus [Domestic cat] (Ensembl 14_67)",
                        path: "/data2/collections/genomeservices/1.0.0/14_67/Felis_catus.CAT/de_support/",
                        created_on: "1346948048000",
                        last_modified_on: "1378823157000",
                    },
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};
