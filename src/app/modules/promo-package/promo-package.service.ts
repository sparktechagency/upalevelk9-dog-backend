/* eslint-disable @typescript-eslint/ban-ts-comment */
import ApiError from '../../../errors/ApiError';
import { IPromoItem, IPromoPackage } from './promo-package.interface';
import { PromoPackage } from './promo-package.model';

//! Admin Management Start
const addPromo = async (payload: IPromoPackage) => {
  const checkIsExist = await PromoPackage.findOne({ title: payload.title });
  if (checkIsExist) {
    throw new ApiError(404, 'Promo already exist');
  }
  const result = await PromoPackage.create(payload);
  return result;
};

const addPromoByTitle = async (payload: IPromoItem) => {
  const promo = await PromoPackage.findOne({
    _id: payload.promo_package_id,
  });
  if (!promo) {
    throw new ApiError(404, 'Promos Not Found');
  }

  //@ts-ignore
  promo.items.push({ title: payload.title });
  await promo.save();
  return promo;
};

const getPromos = async () => {
  //   console.log(id);
  const result = await PromoPackage.find({});
  return result;
};

const updatePromosTitle = async (id: string, payload: any) => {
  try {
    const subs = await PromoPackage.findOne({ _id: id });

    if (!subs) {
      throw new ApiError(404, 'Item not found');
    }

    const result = await PromoPackage.findOneAndUpdate(
      { _id: id },
      { ...payload },
      { new: true, runValidators: true },
    );
    return result;
  } catch (error) {
    console.error(error);
    //@ts-ignore
    throw new Error(error?.message);
  }
};
const updatePromosItem = async (id: string, payload: any) => {
  try {
    const subs = await PromoPackage.findOne({ 'items._id': id });

    if (!subs) {
      throw new ApiError(404, 'Item not found');
    }

    const result = await PromoPackage.findOneAndUpdate(
      { 'items._id': id },
      { $set: { 'items.$.title': payload.title } },
      { new: true },
    );
    return result;
  } catch (error) {
    console.error(error);
    //@ts-ignore
    throw new Error(error?.message);
  }
};

const deletePromosTitle = async (id: string) => {
  try {
    const subs = await PromoPackage.findOne({ 'promo_package_id._id': id });

    if (!subs) {
      throw new ApiError(404, 'Item not found');
    }

    await PromoPackage.updateOne(
      { _id: subs._id },
      { $pull: { items: { _id: id } } },
    );
  } catch (error) {
    console.error(error);
  }
};
const deletePromos = async (id: string) => {
  const check = await PromoPackage.findById(id);
  if (!check) {
    throw new ApiError(404, 'Promo not found');
  }
  return await PromoPackage.findByIdAndDelete(id);
};

export const PromosPlanService = {
  addPromo,
  addPromoByTitle,
  deletePromosTitle,
  getPromos,
  deletePromos,
  updatePromosTitle,
  updatePromosItem,
};
