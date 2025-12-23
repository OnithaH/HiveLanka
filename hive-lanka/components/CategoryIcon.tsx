import Image from 'next/image';

interface CategoryIconProps {
  name: string;
  image: string;
}

export default function CategoryIcon({ name, image }: CategoryIconProps) {
  return (
    <div className="category-icon-item">
      <div className="category-circle">
        <Image 
          src={image} 
          alt={name} 
          width={120}
          height={120}
          className="category-image"
        />
      </div>
    </div>
  );
}