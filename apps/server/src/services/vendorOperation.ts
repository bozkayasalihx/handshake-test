import { appDataSource } from "../loaders";
import { Vendor, VendorRegion } from "../models";
import BaseService from "./BaseService";

export class VendorOperation extends BaseService {
    private Vendor = Vendor;

    public get repo() {
        return this.source.getRepository(Vendor);
    }

    public get vendorRegionRepo() {
        return appDataSource.getRepository(VendorRegion);
    }

    public createVendorRegion(params: Partial<VendorRegion>) {
        return VendorRegion.create<VendorRegion>(params);
    }

    public createVendor(params: Partial<Vendor>) {
        return Vendor.create<Vendor>({
            ...params,
        });
    }
}

export default new VendorOperation();
