import { getDoctorAvatarData } from './helpers';

describe('getDoctorAvatarData', () => {
  test('returns male symbol for male doctor', () => {
    const avatar = getDoctorAvatarData({ name: 'Dr. Ali Hassan', gender: 'Male' });

    expect(avatar.gender).toBe('male');
    expect(avatar.initials).toBe('♂');
  });

  test('returns female symbol for female doctor', () => {
    const avatar = getDoctorAvatarData({ name: 'Dr. Sara Khan', gender: 'Female' });

    expect(avatar.gender).toBe('female');
    expect(avatar.initials).toBe('♀');
  });
});
