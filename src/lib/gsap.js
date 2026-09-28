// Point d'entrée unique pour GSAP : on enregistre les plugins une seule fois.
// Depuis GSAP 3.13, SplitText et ScrambleText sont inclus gratuitement dans le paquet `gsap`.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP)

export const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#K3'

export { gsap, ScrollTrigger, SplitText, useGSAP }
