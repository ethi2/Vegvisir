import java.security.SecureRandom;
import java.math.BigInteger;

public class BadKeyGen
{
	private static final int BigIntBitCount = 512;
	private static final int MultiplierRandom = 128;
	public static void main(String[] args)
	{
		int BIBC = BadKeyGen.BigIntBitCount;
		int MC = MultiplierRandom;
		int temp;
		switch(args.length)
		{
			default:
			case 2:
				try
				{
					temp = Integer.parseInt(args[1]);
				}
				catch(Exception e)
				{
					System.err.println(e);
					temp = BadKeyGen.MultiplierRandom;
				}
				if(temp >= 0)
				{
					MC = temp;
				}
				else
				{
					System.err.println("2nd input less than 0 and ignored");
				}
			case 1:
				try
				{
					temp = Integer.parseInt(args[0]);
				}
				catch(Exception e)
				{
					System.err.println(e);
					temp = BadKeyGen.BigIntBitCount;
				}
				if(temp >= 2)
				{
					BIBC = temp;
				}
				else
				{
					System.err.println("1st input less than 2 and ignored");
				}
			case 0:
				break;
		}
		SecureRandom r = new SecureRandom();
		BigInteger P = BigInteger.probablePrime(BIBC,r);
		BigInteger m = new BigInteger(Integer.toString((int)(Math.random()*MC)*2+1));
		BigInteger Q = P.multiply(m).nextProbablePrime();
		System.out.println(P.multiply(Q));
	}
}