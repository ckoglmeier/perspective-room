export declare const perspectiveRoomSchema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://perspectiveapp.io/standards/perspective_room.v1.schema.json";
    readonly title: "Perspective Room";
    readonly description: "Founder-controlled, self-hostable room for AI-native fundraising for founders.";
    readonly type: "object";
    readonly required: readonly ["schema_version", "room_id", "title"];
    readonly additionalProperties: true;
    readonly properties: {
        readonly schema_version: {
            readonly const: "perspective_room.v1";
        };
        readonly room_id: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly title: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly bundle_mode: {
            readonly enum: readonly ["public", "metadata_only", "hybrid"];
        };
        readonly company: {
            readonly type: "object";
            readonly additionalProperties: true;
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                };
                readonly website: {
                    readonly type: "string";
                };
                readonly one_line_summary: {
                    readonly type: "string";
                };
            };
        };
        readonly narrative: {
            readonly $ref: "#/$defs/trustBlock";
        };
        readonly claims: {
            readonly type: "array";
            readonly items: {
                readonly allOf: readonly [{
                    readonly $ref: "#/$defs/trustBlock";
                }, {
                    readonly type: "object";
                    readonly required: readonly ["claim"];
                    readonly properties: {
                        readonly claim: {
                            readonly type: "string";
                            readonly minLength: 1;
                        };
                        readonly evidence: {
                            readonly type: "string";
                        };
                    };
                }];
            };
        };
        readonly materials: {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly required: readonly ["id", "display_name"];
                readonly additionalProperties: true;
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly minLength: 1;
                    };
                    readonly display_name: {
                        readonly type: "string";
                        readonly minLength: 1;
                    };
                    readonly filename: {
                        readonly type: "string";
                    };
                    readonly included_in_bundle: {
                        readonly type: "boolean";
                    };
                    readonly listed_in_manifest: {
                        readonly type: "boolean";
                    };
                    readonly local_path: {
                        readonly type: "string";
                    };
                    readonly download_url: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly external_access_required: {
                        readonly type: "boolean";
                    };
                    readonly sensitive: {
                        readonly type: "boolean";
                    };
                };
            };
        };
        readonly boundaries: {
            readonly type: "object";
            readonly additionalProperties: true;
            readonly properties: {
                readonly claims_are_founder_statements: {
                    readonly type: "boolean";
                };
                readonly diligence_performed: {
                    readonly type: "boolean";
                };
                readonly gated_materials_reviewed: {
                    readonly type: "boolean";
                };
            };
        };
    };
    readonly $defs: {
        readonly source: {
            readonly type: "object";
            readonly additionalProperties: false;
            readonly properties: {
                readonly material_id: {
                    readonly type: "string";
                };
                readonly url: {
                    readonly type: "string";
                };
                readonly page: {
                    readonly type: "string";
                };
                readonly excerpt: {
                    readonly type: "string";
                };
                readonly note: {
                    readonly type: "string";
                };
            };
        };
        readonly trustBlock: {
            readonly type: "object";
            readonly additionalProperties: true;
            readonly properties: {
                readonly authored_by: {
                    readonly enum: readonly ["founder", "perspective", "third_party", "unknown"];
                };
                readonly status: {
                    readonly enum: readonly ["draft", "founder_approved", "needs_source", "source_linked", "outdated"];
                };
                readonly sources: {
                    readonly type: "array";
                    readonly items: {
                        readonly $ref: "#/$defs/source";
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=schema.d.ts.map