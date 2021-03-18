import { Meteor } from 'meteor/meteor';

declare const cloudinary;

interface cloudinaryObject {
  event: string;
  info: {
    access_mode: string;
    bytes: number;
    created_at: string;
    etag: string;
    format: string;
    height: number;
    original_filename: string;
    path: string;
    placeholder: boolean;
    public_id: string;
    resource_type: string;
    secure_url: string;
    signature: string;
    tags: string[];
    thumbnail_url: string;
    type: string;
    url: string;
    version: number; event
    width: number;
  }
}

/**
 * Opens the Cloudinary Upload widget and sets the value of the input field with name equal to nameAttribute to the
 * resulting URL of the uploaded picture.
 * @param nameAttribute The value of the associated input field's name attribute.
 * @memberOf ui/components/form-fields
 */
export const openCloudinaryWidget = () => new Promise<cloudinaryObject>((resolve, reject) => cloudinary.openUploadWidget(
  {
    cloud_name: Meteor.settings.public.cloudinary.cloud_name,
    upload_preset: Meteor.settings.public.cloudinary.upload_preset,
    sources: ['local', 'url', 'camera'],
    cropping: 'server',
    cropping_aspect_ratio: 1,
    max_file_size: '500000',
    max_image_width: '500',
    max_image_height: '500',
    min_image_width: '200',
    min_image_height: '200',
  }, (error, result) => {
    if (error) {
      reject(error);
    }
    if (result.event === 'success') {
      resolve(result);
    }
  },
));
