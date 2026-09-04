import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function TrashIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="m4.458,9l.463,11.125c.067,1.612,1.384,2.875,2.998,2.875h8.163c1.613,0,2.93-1.263,2.998-2.875l.463-11.125H4.458Z" />
      <path d="m16,5V1h-8v4H2v2h20v-2h-6Zm-6-2h4v2h-4v-2Z" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22.75V19.25L22 14.25V17.75L12 22.75Z" fill="currentColor" opacity="0.3" />
      <path d="M12 19.25V22.25" />
      <path d="M2 14.25L11.5528 19.0264C11.8343 19.1672 12.1657 19.1672 12.4472 19.0264L22 14.25" />
      <path d="M17.3297 11.9148L21.4472 13.9736C21.786 14.143 22 14.4893 22 14.868V17.132C22 17.5107 21.786 17.857 21.4472 18.0264L12.6708 22.4146C12.2485 22.6257 11.7515 22.6257 11.3292 22.4146L2.55279 18.0264C2.214 17.857 2 17.5107 2 17.132V14.868C2 14.4893 2.214 14.143 2.55279 13.9736L8 11.25" />
      <path d="M15.2006 3.64674L12.941 4.72948V10.4413L15.3105 9.24871L15.2006 3.64674Z" fill="currentColor" opacity="0.3" />
      <path d="M5 6.76267L7.65552 8.09377C7.988 8.26043 8.37957 8.01869 8.37957 7.64678V5.4223" strokeMiterlimit="10" />
      <path d="M12.9312 4.75765L15.207 3.61975" />
      <path d="M12.9312 10.4815L15.207 9.34357" />
      <path d="M16.331 12.4307L13.2188 10.8774C13.0495 10.7929 12.9424 10.6202 12.9421 10.431L12.9312 4.66371L8.37958 2.38791" strokeMiterlimit="10" />
      <path d="M8.37958 5.42231V3.00594C8.37958 2.62717 8.59357 2.28091 8.93236 2.11151L9.98454 1.58541C10.4068 1.37427 10.9039 1.37426 11.3262 1.58541L14.6555 3.25003C14.9936 3.4191 15.2075 3.7644 15.2083 4.14245L15.2184 9.2224L18.1051 10.6647C18.4738 10.8489 18.4738 11.3749 18.1053 11.5592L11.4466 14.8885C10.9948 15.1144 10.4455 14.9679 10.1662 14.547L5.31033 7.23028C5.14504 6.98122 5.23376 6.64373 5.50018 6.50817L8.00028 5.23601L8.37958 5.42231Z" strokeMiterlimit="10" strokeLinecap="square" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="currentColor"
      {...props}
    >
      <path d="M4,14.75c-.192,0-.384-.073-.53-.22-.293-.293-.293-.768,0-1.061L13.47,3.47c.293-.293,.768-.293,1.061,0s.293,.768,0,1.061L4.53,14.53c-.146,.146-.338,.22-.53,.22Z" />
      <path d="M14,14.75c-.192,0-.384-.073-.53-.22L3.47,4.53c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0L14.53,13.47c.293,.293,.293,.768,0,1.061-.146,.146-.338,.22-.53,.22Z" />
    </svg>
  );
}

export function FileTextIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="5.75" y1="6.75" x2="7.75" y2="6.75" />
      <line x1="5.75" y1="9.75" x2="12.25" y2="9.75" />
      <line x1="5.75" y1="12.75" x2="12.25" y2="12.75" />
      <path d="M2.75,14.25V3.75c0-1.105,.895-2,2-2h5.586c.265,0,.52,.105,.707,.293l3.914,3.914c.188,.188,.293,.442,.293,.707v7.586c0,1.105-.895,2-2,2H4.75c-1.105,0-2-.895-2-2Z" />
      <path d="M15.16,6.25h-3.41c-.552,0-1-.448-1-1V1.852" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeMiterlimit="10"
      {...props}
    >
      <circle cx="16" cy="16" r="6" />
      <path d="m16,6c10,0,14,10,14,10,0,0-4,10-14,10S2,16,2,16c0,0,4-10,14-10Z" />
    </svg>
  );
}
