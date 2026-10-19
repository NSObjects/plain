export function previewBase(env) {
  const [owner, repo] = (env.GITHUB_REPOSITORY ?? '').split('/');
  const isPages = Boolean(env.GITHUB_ACTIONS && owner && repo);
  const value = env.BASE_PATH ??
    (isPages && repo !== `${owner}.github.io` ? `/${repo}` : '/');
  return value.endsWith('/') ? value : value + '/';
}
