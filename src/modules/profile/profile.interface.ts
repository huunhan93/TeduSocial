export interface IProfile {
    _id: string;
    user: string;
    company: string;
    website: string;
    location: string;
    status: string;
    skills: string[];
    bio: string;
    experience: IExperience[];
    education: IEducation[];
    social: ISocial;
    followings : IFollower[];
    followers : IFollower[];
    date: Date;
}

export interface IExperience{
    _id: string;
    title: string;
    company: string;
    location: string;
    from: Date;
    to: Date;
    current: boolean;
    description: string;
}

export interface IEducation{
    _id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    from: string;
    to: string;
    current: boolean;
    description: string;
}

export interface ISocial extends Record<string,string>{
    youtube: string;
    twitter: string;
    linkedIn: string;
    facebook: string;
    instagram: string;
}

export interface IFollower {
    user: string
}