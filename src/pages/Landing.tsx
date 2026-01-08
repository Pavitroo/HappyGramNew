import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera, Heart, MessageCircle, Users, Sparkles, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-brand-text">HappyGram</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button variant="gradient" size="sm">Sign up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-12 pb-24 lg:px-12 lg:pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-secondary-foreground">Share your happiest moments</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Capture{' '}
                <span className="gradient-brand-text">happiness,</span>
                <br />
                share{' '}
                <span className="gradient-brand-text">memories</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Connect with friends, share your life's best moments, and discover inspiring content from creators around the world.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?mode=signup">
                  <Button variant="gradient" size="xl" className="w-full sm:w-auto group">
                    Get started free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    I have an account
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-border">
                <div>
                  <div className="text-3xl font-bold gradient-brand-text">10M+</div>
                  <div className="text-sm text-muted-foreground">Active users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-brand-text">50M+</div>
                  <div className="text-sm text-muted-foreground">Photos shared</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-brand-text">100+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>

            {/* Right content - Phone mockup */}
            <div className="relative flex justify-center lg:justify-end animate-slide-up">
              <div className="relative">
                {/* Phone frame */}
                <div className="w-72 h-[580px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-6 py-3">
                      <span className="text-xs font-medium">9:41</span>
                      <div className="w-20 h-6 bg-foreground rounded-full" />
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-sm bg-foreground/30" />
                        <div className="w-4 h-4 rounded-sm bg-foreground/30" />
                      </div>
                    </div>
                    
                    {/* App header */}
                    <div className="px-4 py-3 border-b border-border">
                      <span className="text-xl font-bold gradient-brand-text">HappyGram</span>
                    </div>

                    {/* Stories */}
                    <div className="flex gap-3 px-4 py-4 overflow-x-auto">
                      {['Your Story', 'Sarah', 'Mike', 'Emma'].map((name, i) => (
                        <div key={name} className="flex flex-col items-center gap-1">
                          <div className={`w-14 h-14 rounded-full p-0.5 ${i === 0 ? 'border-2 border-dashed border-muted-foreground' : 'story-ring'}`}>
                            <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center">
                              {i === 0 ? (
                                <span className="text-xl">+</span>
                              ) : (
                                <span className="text-lg">{name[0]}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Post preview */}
                    <div className="px-4">
                      <div className="flex items-center gap-2 py-2">
                        <div className="w-8 h-8 rounded-full bg-secondary" />
                        <span className="text-sm font-medium">happyuser</span>
                      </div>
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <Camera className="w-12 h-12 text-primary/40" />
                      </div>
                      <div className="flex gap-4 py-3">
                        <Heart className="w-6 h-6" />
                        <MessageCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -left-16 top-20 bg-card p-4 rounded-2xl shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-brand rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">2.5k likes</div>
                      <div className="text-xs text-muted-foreground">on your post</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-12 bottom-32 bg-card p-4 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">+50 followers</div>
                      <div className="text-xs text-muted-foreground">this week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Everything you need to{' '}
              <span className="gradient-brand-text">share happiness</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you connect, create, and share your best moments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: 'Beautiful Photos',
                description: 'Share stunning photos with built-in filters and editing tools.',
              },
              {
                icon: Heart,
                title: 'Connect & Engage',
                description: 'Like, comment, and interact with content from people you love.',
              },
              {
                icon: Users,
                title: 'Discover People',
                description: 'Find and follow amazing creators from around the world.',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 gradient-brand rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to share your{' '}
            <span className="gradient-brand-text">happiness?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join millions of happy users sharing their best moments every day.
          </p>
          <Link to="/auth?mode=signup">
            <Button variant="gradient" size="xl" className="group">
              Start sharing now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">HappyGram</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 HappyGram. Share happiness, spread joy.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
