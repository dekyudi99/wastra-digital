import { Button } from 'antd'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const OnboardingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 4rem 0;
  background: ${props => props.bgColor || '#faf9f6'};
  
  @media (max-width: 768px) {
    min-height: auto;
    padding: 3rem 0;
  }
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

const IllustrationBox = styled.div`
  width: 100%;
  height: 400px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)'};
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`

const TextContent = styled.div`
  max-width: 500px;
  
  @media (max-width: 968px) {
    max-width: 100%;
    order: -1;
  }
`

const OnboardingSection = ({ 
  title, 
  description, 
  buttonText, 
  buttonLink,
  illustration,
  bgColor,
  gradient,
  reverse = false 
}) => {
  return (
    <OnboardingContainer bgColor={bgColor}>
      <div className="container mx-auto px-4">
        <ContentWrapper style={{ direction: reverse ? 'rtl' : 'ltr' }}>
          <div style={{ direction: 'ltr' }}>
            <IllustrationBox gradient={gradient}>
              {illustration}
            </IllustrationBox>
          </div>
          <TextContent>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              {description}
            </p>
            {buttonLink ? (
              buttonLink.startsWith('/') ? (
                <Link to={buttonLink}>
                  <Button 
                    type="primary" 
                    size="large"
                    className="bg-wastra-red hover:bg-wastra-red/90 border-none h-12 px-8 text-base text-white"
                    icon={<ArrowRightIcon className="w-5 h-5" />}
                    iconPosition="end"
                  >
                    {buttonText}
                  </Button>
                </Link>
              ) : (
                <a 
                  href={buttonLink}
                  onClick={(e) => {
                    if (buttonLink.startsWith('#')) {
                      e.preventDefault()
                      const element = document.querySelector(buttonLink)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }
                  }}
                >
                  <Button 
                    type="primary" 
                    size="large"
                    className="bg-wastra-red hover:bg-wastra-red/90 border-none h-12 px-8 text-base text-white"
                    icon={<ArrowRightIcon className="w-5 h-5" />}
                    iconPosition="end"
                  >
                    {buttonText}
                  </Button>
                </a>
              )
            ) : (
              <Button 
                type="primary" 
                size="large"
                className="bg-wastra-red hover:bg-wastra-red/90 border-none h-12 px-8 text-base text-white"
                icon={<ArrowRightIcon className="w-5 h-5" />}
                iconPosition="end"
              >
                {buttonText}
              </Button>
            )}
          </TextContent>
        </ContentWrapper>
      </div>
    </OnboardingContainer>
  )
}

export default OnboardingSection

